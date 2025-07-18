"use client";

import React, { useEffect, useState } from "react";
import MealCard from "./MealCard";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import Link from 'next/link';


import { Search, Clock, Users, ChefHat } from "lucide-react";
import styles from "./MealList.module.css";

function MealsList() {
  const [meals, setMeals] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch(api("meals?limit=10"))
      .then((res) => res.json())
      .then((data) => {
        setMeals(data);
      })
      .catch((err) => {
        console.error("Error fetching meals:", err);
      });
  }, []);

  if (meals.length === 0) return <p>Loading meals...</p>;

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

  return (
    <div className={styles.container}>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Search and Filter Section */}

 <div className={styles.searchSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Meals</h2>
            <Link href="/meals" className={styles.seeAllButton}>
              See All Meals
            </Link>
          </div>
        </div>


        {/* Recipe Grid */}
        <div className={styles.recipeGrid}>
          {meals.map((event) => (
            <div key={event.id} className={styles.recipeCard}>
              <div className={styles.imageContainer}>
                <img
                  src={event.image}
                  alt={event.title}
                  className={styles.recipeImage}
                />
                <div className={styles.categoryBadge}>${event.price}</div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.recipeName}>{event.title}</h3>
                  <span className={styles.locationBadge}>
                    {event.max_reservations} spots
                  </span>
                </div>
                <p className={styles.recipeDescription}>{event.description}</p>

                <div className={styles.recipeInfo}>
                  <div className={styles.infoItem}>
                    <Clock className={styles.infoIcon} />
                    <span>{formatDate(event.when)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <Clock className={styles.infoIcon} />
                    <span>{formatTime(event.when)}</span>
                  </div>
                </div>

                <div className={styles.locationSection}>
                  <div className={styles.locationInfo}>
                    <Users className={styles.infoIcon} />
                    <span className={styles.locationText}>
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {meals.length === 0 && (
          <div className={styles.noResults}>
            <ChefHat className={styles.noResultsIcon} />
            <h3 className={styles.noResultsTitle}>No events found</h3>
            <p className={styles.noResultsText}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© 2025 Food Events. Made with ❤️ for food lovers.</p>
        </div>
      </footer>
    </div>
  );
}

export default MealsList;
