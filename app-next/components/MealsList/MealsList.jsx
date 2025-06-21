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

 if (meals.length === 0) return <p>Loading meals...</p>;

  return (
    <table className="meals-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {meals.map(({ id, title, description, price }) => (
          <tr key={id}>
            <td>{title}</td>
            <td>{description}</td>
            <td>${price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default MealsList;