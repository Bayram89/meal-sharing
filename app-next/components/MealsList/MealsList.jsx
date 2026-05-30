"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
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
          <p className={styles.sectionEyebrow}>Happening soon</p>
          <h2 className={styles.sectionTitle}>Join a table that feels right.</h2>
          <p className={styles.sectionText}>
            See who is hosting, how full the table is, and what kind of night
            you are stepping into before you decide to join.
          </p>
        </div>

        <Link href="/meals" className={styles.seeAllButton}>
          Browse experiences
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
