"use client";

import React, { useEffect, useState } from "react";
import MealCard from "./MealCard";

function MealsList() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/meals?limit=10")
      .then((res) => res.json())
      .then((data) => {
        setMeals(data);
      })
      .catch((err) => {
        console.error("Error fetching meals:", err);
      });
  }, []);

  if (meals.length === 0) return <p>Loading meals...</p>;

  return (
    <div className="meals-list">
      <div className="meals-header">
        <span className="header-title">Title</span>
        <span className="header-description">Description</span>
        <span className="header-price">Price</span>
      </div>
      {meals.map(({ id, title, description, price }) => (
        <MealCard
          key={id}
          title={title}
          description={description}
          price={price}
        />
      ))}
    </div>
  );
}

export default MealsList;
