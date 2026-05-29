import React from "react";
import api from "@/utils/api";
import AllMeals from "@/components/AllMeals/AllMeals";

export default async function MealsPage() {
    let meals = [];

    try {
        const res = await fetch(api("meals"), { cache: "no-store" });
        if (!res.ok) {
            throw new Error(`Failed to fetch meals (${res.status})`);
        }

        const data = await res.json();
        meals = Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("MealsPage fetch failed:", error);
    }

    return (
       <AllMeals meals={meals}/>
    );
}
