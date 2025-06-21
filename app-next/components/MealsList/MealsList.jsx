"use client";

import React, { useEffect, useState } from "react";

function MealsList() {
  const [meals, setMeals] = useState([]);

useEffect(() => {
    fetch("http://localhost:3001/api/meals")
    .then((res) => res.json())
      .then((data) => {
        setMeals(data);
      })
      .catch((err) => {
        console.error("Error fetching meals:", err);
      });
  }, []);

  return (
 <div>
      <h2>Meals List</h2>
      {meals.length === 0 ? (
        <p>Loading meals...</p>
      ) : (
        meals.map((meal) => (
          <div key={meal.id}>
            <p><strong>Title:</strong> {meal.title}</p>
            <p><strong>Description:</strong> {meal.description}</p>
            <p><strong>Price:</strong> ${meal.price}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default MealsList;