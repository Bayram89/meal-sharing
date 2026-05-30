"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./AllMeals.module.css";
import { Search, ChefHat, ArrowLeft, MapPin, CalendarDays } from "lucide-react";

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
        meal.location?.toLowerCase().includes(query) ||
        meal.host_name?.toLowerCase().includes(query)
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

  return (
    <div className={styles.pageShell}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.backButton}>
            <ArrowLeft className={styles.backIcon} />
            Back home
          </Link>

          <div className={styles.headerInfo}>
            <p className={styles.headerEyebrow}>Join a table</p>
            <h1 className={styles.title}>Dinner plans, made more personal.</h1>
            <p className={styles.subtitle}>
              Find small hosted meals where the atmosphere, the people, and the
              host matter just as much as the food.
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
              placeholder="Search by table, host, or neighborhood"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.sortSection}>
            <label className={styles.selectGroup}>
              <span>Sort</span>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
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
                onChange={(e) => setSortDir(e.target.value)}
                className={styles.select}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>
        </section>

        <div className={styles.resultsCount}>
          <p>{filteredMeals.length} tables open for booking</p>
        </div>

        <div className={styles.mealsGrid}>
          {filteredMeals.map((meal) => (
            <Link key={meal.id} href={`/meals/${meal.id}`} className={styles.mealCard}>
              <div className={styles.imageContainer}>
                <img src={meal.image} alt={meal.title} className={styles.mealImage} />
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.mealName}>{meal.title}</h3>

                <div className={styles.cardMeta}>
                  <p className={styles.hostLine}>Hosted by {meal.host_name}</p>
                  <p className={styles.fillLine}>
                    {meal.reserved_seats}/{meal.max_reservations} seats filled
                  </p>
                </div>

                <div className={styles.mealInfo}>
                  <div className={styles.infoItem}>
                    <CalendarDays className={styles.infoIcon} />
                    <span>
                      {formatDate(meal.when)} {" | "} {formatTime(meal.when)}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <MapPin className={styles.infoIcon} />
                    <span>{meal.location}</span>
                  </div>
                </div>

                <p className={styles.mealDescription}>{meal.description}</p>

                <div className={styles.cardFooter}>
                  <div>
                    <span className={styles.priceLabel}>From</span>
                    <span className={styles.metaBadge}>DKK {meal.price}</span>
                  </div>
                  <span className={styles.cardLink}>See what this table is like</span>
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
