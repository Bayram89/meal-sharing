"use client";

import React from "react";

export default function MealCard({ title, description, price }) {
  return (
    <tr>
      <td>{title} </td>
      <td>{description}</td>
      <td>${price}</td>
    </tr>
  );
}
