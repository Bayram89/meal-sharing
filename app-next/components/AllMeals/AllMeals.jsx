"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./AllMeals.module.css";
import api from "@/utils/api";
import { Search, Clock, Users, ChefHat, ArrowLeft, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useEffect } from "react";

const SORT_FIELDS = [
    { value: "price", label: "Price" },
    { value: "when", label: "When" },
    { value: "max_reservations", label: "Max Reservations" },
];

const SORT_DIRECTIONS = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
];

export default function AllMeals({ meals }) {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState("title");
    const [sortDir, setSortDir] = useState("asc");
    const [filteredMeals, setFilteredMeals] = useState(Array.isArray(meals) ? meals : []);


  useEffect(() => {
    let filtered = meals.filter(meal => {
      const matchesSearch = meal.title?.toLowerCase().includes(search.toLowerCase()) ||
                           meal.description?.toLowerCase().includes(search.toLowerCase()) ||
                           meal.location?.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });

    // sorting the results 
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortKey) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "price":
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case "when":
          aValue = new Date(a.when);
          bValue = new Date(b.when);
          break;
        case "max_reservations":
          aValue = a.max_reservations;
          bValue = b.max_reservations;
          break;
        case "location":
          aValue = a.location.toLowerCase();
          bValue = b.location.toLowerCase();
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (sortDir === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredMeals(filtered);
  }, [search, sortKey, sortDir, meals]);

  const handleSortChange = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const getSortIcon = (key) => {
    if (sortKey !== key) {
      return <ArrowUpDown className={styles.sortIcon} />;
    }
    return sortDir === "asc" ? 
      <ArrowUp className={styles.sortIconActive} /> : 
      <ArrowDown className={styles.sortIconActive} />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
    const fetchMeals = async (searchValue, key, dir) => {
        try {
            const params = [
                searchValue ? `title=${encodeURIComponent(searchValue)}` : "",
                `sortKey=${encodeURIComponent(key)}`,
                `sortDir=${encodeURIComponent(dir)}`
            ].filter(Boolean).join("&");
            const res = await fetch(api(`meals?${params}`));
            const data = await res.json();
            setFilteredMeals(Array.isArray(data) ? data : []);
        } catch (error) {
            setFilteredMeals([]);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        fetchMeals(search, sortKey, sortDir);
    };

    const handleSortKeyChange = (e) => {
        const newSortKey = e.target.value;
        setSortKey(newSortKey);
        fetchMeals(search, newSortKey, sortDir);
    };

    const handleSortDirChange = (e) => {
        const newSortDir = e.target.value;
        setSortDir(newSortDir);
        fetchMeals(search, sortKey, newSortDir);
    };

     return (
    <div className={styles.container}>
      
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <Link href="/" className={styles.backButton}>
              <ArrowLeft className={styles.backIcon} />
              Back
            </Link>
            <div className={styles.headerInfo}>
              <ChefHat className={styles.logo} />
              <div>
                <h1 className={styles.title}>All Meals</h1>
                <p className={styles.subtitle}>Discover all our culinary experiences</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>

        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search all meals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.sortSection}>
            <span className={styles.sortLabel}>Sort by:</span>
            <div className={styles.sortButtons}>
              <button
                onClick={() => handleSortChange("title")}
                className={`${styles.sortButton} ${sortKey === "title" ? styles.sortButtonActive : ""}`}
              >
                Name {getSortIcon("title")}
              </button>
              <button
                onClick={() => handleSortChange("price")}
                className={`${styles.sortButton} ${sortKey === "price" ? styles.sortButtonActive : ""}`}
              >
                Price {getSortIcon("price")}
              </button>
              <button
                onClick={() => handleSortChange("when")}
                className={`${styles.sortButton} ${sortKey === "when" ? styles.sortButtonActive : ""}`}
              >
                Date {getSortIcon("when")}
              </button>
              <button
                onClick={() => handleSortChange("max_reservations")}
                className={`${styles.sortButton} ${sortKey === "max_reservations" ? styles.sortButtonActive : ""}`}
              >
                Spots {getSortIcon("max_reservations")}
              </button>
              <button
                onClick={() => handleSortChange("location")}
                className={`${styles.sortButton} ${sortKey === "location" ? styles.sortButtonActive : ""}`}
              >
                Location {getSortIcon("location")}
              </button>
            </div>
          </div>
          
          
        </div>

        <div className={styles.resultsCount}>
          <p>{filteredMeals.length} meal{filteredMeals.length !== 1 ? 's' : ''} found</p>
        </div>


        <div className={styles.mealsGrid}>
          {filteredMeals.map((meal) => (
            <div key={meal.id} className={styles.mealCard}>
              <div className={styles.imageContainer}>
                <img
                  src={meal.image}
                  alt={meal.title}
                  className={styles.mealImage}
                />
                <div className={styles.priceBadge}>
                  ${meal.price}
                </div>
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.mealName}>{meal.title}</h3>
                  <span className={styles.spotsBadge}>
                    {meal.max_reservations} spots
                  </span>
                </div>
                <p className={styles.mealDescription}>
                  {meal.description}
                </p>
                
                <div className={styles.mealInfo}>
                  <div className={styles.infoItem}>
                    <Clock className={styles.infoIcon} />
                    <span>{formatDate(meal.when)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <Clock className={styles.infoIcon} />
                    <span>{formatTime(meal.when)}</span>
                  </div>
                </div>
                
                <div className={styles.locationSection}>
                  <div className={styles.locationInfo}>
                    <Users className={styles.infoIcon} />
                    <span className={styles.locationText}>{meal.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
                
        {filteredMeals.length === 0 && (
          <div className={styles.noResults}>
            <ChefHat className={styles.noResultsIcon} />
            <h3 className={styles.noResultsTitle}>No meals found</h3>
            <p className={styles.noResultsText}>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>

    </div>
  );
}