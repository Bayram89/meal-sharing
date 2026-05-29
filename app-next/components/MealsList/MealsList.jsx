"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, MapPin, Users } from "lucide-react";
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

function MealsList() {
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(api("meals?limit=6"))
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch meals (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        setMeals(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching meals:", err);
        setMeals([]);
        setError("Meals are temporarily unavailable. Please try again later.");
      });
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionEyebrow}>Upcoming experiences</p>
          <h2 className={styles.sectionTitle}>Book a table with confidence.</h2>
          <p className={styles.sectionText}>
            Smaller guest counts, clearer details, and warmer presentation make
            every listing easier to trust at a glance.
          </p>
        </div>

        <Link href="/meals" className={styles.seeAllButton}>
          View all meals
        </Link>
      </div>

      {error ? <p className={styles.feedback}>{error}</p> : null}
      {!error && meals.length === 0 ? (
        <p className={styles.feedback}>Loading upcoming meals...</p>
      ) : null}

      <div className={styles.recipeGrid}>
        {meals.map((meal) => (
          <Link key={meal.id} href={`/meals/${meal.id}`} className={styles.recipeCard}>
            <div className={styles.imageContainer}>
              <img src={meal.image} alt={meal.title} className={styles.recipeImage} />
              <div className={styles.priceBadge}>DKK {meal.price}</div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.cardTopRow}>
                <p className={styles.locationLine}>
                  <MapPin className={styles.inlineIcon} />
                  {meal.location}
                </p>
                <span className={styles.spotsBadge}>{meal.max_reservations} seats</span>
              </div>

              <h3 className={styles.recipeName}>{meal.title}</h3>
              <p className={styles.recipeDescription}>{meal.description}</p>

              <div className={styles.recipeInfo}>
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
                  <span>Hosted table</span>
                </div>
              </div>

              <span className={styles.cardLink}>View details</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default MealsList;
