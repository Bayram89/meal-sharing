import React from "react";
import api from "@/utils/api";
import AllMeals from "@/components/AllMeals/AllMeals";

export default async function MealsPage() {
    const res = await fetch(api("meals"), { cache: "no-store" });
    const meals = await res.json();

    return (
       <AllMeals meals={meals}/>
    );
}
