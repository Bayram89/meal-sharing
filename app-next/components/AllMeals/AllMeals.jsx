"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./AllMeals.module.css";
import api from "@/utils/api";
import {
  Search,
  Clock3,
  Users,
  ChefHat,
  ArrowLeft,
  MapPin,
  CalendarDays,
} from "lucide-react";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AllMeals({ meals }) {
  const safeMeals = Array.isArray(meals) ? meals : [];
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("when");
  const [sortDir, setSortDir] = useState("asc");
  const [filteredMeals, setFilteredMeals] = useState(safeMeals);

  useEffect(() => {
    let filtered = safeMeals.filter((meal) => {
      const query = search.toLowerCase();
      return (
        meal.title?.toLowerCase().includes(query) ||
        meal.description?.toLowerCase().includes(query) ||
        meal.location?.toLowerCase().includes(query)
      );
    });

    filtered = [...filtered].sort((a, b) => {
      let aValue = a[sortKey];
      let bValue = b[sortKey];

      if (sortKey === "price" || sortKey === "max_reservations") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortKey === "when") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      return sortDir === "asc" ? aValue - bValue : bValue - aValue;
    });

    setFilteredMeals(filtered);
  }, [safeMeals, search, sortKey, sortDir]);

  const fetchMeals = async (searchValue, nextSortKey, nextSortDir) => {
    try {
      const params = [
        searchValue ? `title=${encodeURIComponent(searchValue)}` : "",
        `sortKey=${encodeURIComponent(nextSortKey)}`,
        `sortDir=${encodeURIComponent(nextSortDir)}`,
      ]
        .filter(Boolean)
        .join("&");

      const res = await fetch(api(`meals?${params}`));
      const data = await res.json();
      setFilteredMeals(Array.isArray(data) ? data : []);
    } catch (error) {
      setFilteredMeals([]);
    }
  };

  return (
    <div className={styles.pageShell}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.backButton}>
            <ArrowLeft className={styles.backIcon} />
            Back home
          </Link>

          <div className={styles.headerInfo}>
            <p className={styles.headerEyebrow}>All upcoming meals</p>
            <h1 className={styles.title}>Choose the table that fits your night.</h1>
            <p className={styles.subtitle}>
              Browse by mood, neighborhood, timing, or guest count without the
              clutter of a marketplace-style layout.
            </p>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.controlsPanel}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by meal, mood, or neighborhood"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                fetchMeals(e.target.value, sortKey, sortDir);
              }}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.sortSection}>
            <label className={styles.selectGroup}>
              <span>Sort</span>
              <select
                value={sortKey}
                onChange={(e) => {
                  setSortKey(e.target.value);
                  fetchMeals(search, e.target.value, sortDir);
                }}
                className={styles.select}
              >
                <option value="when">Date</option>
                <option value="price">Price</option>
                <option value="max_reservations">Guest count</option>
              </select>
            </label>

            <label className={styles.selectGroup}>
              <span>Order</span>
              <select
                value={sortDir}
                onChange={(e) => {
                  setSortDir(e.target.value);
                  fetchMeals(search, sortKey, e.target.value);
                }}
                className={styles.select}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>
        </section>

        <div className={styles.resultsCount}>
          <p>{filteredMeals.length} curated meals available</p>
        </div>

        <div className={styles.mealsGrid}>
          {filteredMeals.map((meal) => (
            <Link key={meal.id} href={`/meals/${meal.id}`} className={styles.mealCard}>
              <div className={styles.imageContainer}>
                <img src={meal.image} alt={meal.title} className={styles.mealImage} />
                <div className={styles.priceBadge}>DKK {meal.price}</div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardMeta}>
                  <span className={styles.metaLine}>
                    <MapPin className={styles.infoIcon} />
                    {meal.location}
                  </span>
                  <span className={styles.metaBadge}>{meal.max_reservations} guests</span>
                </div>
                <h3 className={styles.mealName}>{meal.title}</h3>
                <p className={styles.mealDescription}>{meal.description}</p>

                <div className={styles.mealInfo}>
                  <div className={styles.infoItem}>
                    <CalendarDays className={styles.infoIcon} />
                    <span>{formatDate(meal.when)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <Clock3 className={styles.infoIcon} />
                    <span>{formatTime(meal.when)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <Users className={styles.infoIcon} />
                    <span>Hosted experience</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredMeals.length === 0 && (
          <div className={styles.noResults}>
            <ChefHat className={styles.noResultsIcon} />
            <h3 className={styles.noResultsTitle}>No meals match that search</h3>
            <p className={styles.noResultsText}>
              Try a different keyword, neighborhood, or sort order.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
