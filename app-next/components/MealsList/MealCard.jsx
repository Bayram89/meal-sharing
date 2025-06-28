import React from "react";

export default function MealCard({ title, description, price }) {
  return (
    <div className="meal-card">
      <div className="meal-title">{title}</div>
      <div className="meal-description">{description}</div>
      <div className="meal-price">${price}</div>
    </div>
  );
}
