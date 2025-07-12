"use client";

import React, { useEffect, useState } from "react";
import MealCard from "./MealCard";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

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

      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/meals")}
        style={{ marginTop: "1rem" }}
      >
        See all
      </Button>
    </div>
  );
}

export default MealsList;
