"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from "lucide-react";
import api from "@/utils/api";
import styles from "./MealList.module.css";

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

const featuredOrder = [
  "Midnight Tasting Bowl",
  "Mint Garden Lunch",
  "Coastal Catch Evening",
  "Ember Table Supper",
  "Wild Mushroom Gathering",
  "Velvet Sea Table",
];

function MealsList() {
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");
  const sliderRef = useRef(null);

  useEffect(() => {
    fetch(api("meals?limit=6"))
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch meals (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        const safeMeals = Array.isArray(data) ? data : [];
        const sortedMeals = [...safeMeals].sort((a, b) => {
          const aIndex = featuredOrder.indexOf(a.title);
          const bIndex = featuredOrder.indexOf(b.title);

          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;

          return aIndex - bIndex;
        });

        setMeals(sortedMeals);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching meals:", err);
        setMeals([]);
        setError("Meals are temporarily unavailable. Please try again later.");
      });
  }, []);

  const scrollSlider = (direction) => {
    if (!sliderRef.current) {
      return;
    }

    const amount = sliderRef.current.clientWidth * 0.82;
    sliderRef.current.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionEyebrow}>Featured tables this week</p>
          <h2 className={styles.sectionTitle}>A few standout evenings to start with.</h2>
          <p className={styles.sectionText}>
            A quick look at some of the most popular tables in Copenhagen right
            now.
          </p>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.sliderControls}>
            <button
              type="button"
              className={styles.sliderButton}
              onClick={() => scrollSlider("prev")}
              aria-label="Show previous featured meals"
            >
              <ArrowLeft className={styles.sliderIcon} />
            </button>
            <button
              type="button"
              className={styles.sliderButton}
              onClick={() => scrollSlider("next")}
              aria-label="Show next featured meals"
            >
              <ArrowRight className={styles.sliderIcon} />
            </button>
          </div>

          <Link href="/meals" className={styles.seeAllButton}>
            Browse experiences
          </Link>
        </div>
      </div>

      {error ? <p className={styles.feedback}>{error}</p> : null}
      {!error && meals.length === 0 ? (
        <p className={styles.feedback}>Loading upcoming meals...</p>
      ) : null}

      <div ref={sliderRef} className={styles.recipeGrid}>
        {meals.map((meal) => (
          <Link key={meal.id} href={`/meals/${meal.id}`} className={styles.recipeCard}>
            <div className={styles.imageContainer}>
              <img src={meal.image} alt={meal.title} className={styles.recipeImage} />
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.recipeName}>{meal.title}</h3>

              <div className={styles.trustBlock}>
                <p className={styles.hostLine}>Hosted by {meal.host_name}</p>
                <p className={styles.fillLine}>
                  {meal.reserved_seats}/{meal.max_reservations} seats filled
                </p>
              </div>

              <div className={styles.recipeInfo}>
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

              <p className={styles.recipeDescription}>{meal.description}</p>

              <div className={styles.cardFooter}>
                <div>
                  <span className={styles.priceLabel}>From</span>
                  <span className={styles.spotsBadge}>DKK {meal.price}</span>
                </div>
                <span className={styles.cardLink}>Find a table</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default MealsList;
