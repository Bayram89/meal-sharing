"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./AllMeals.module.css";
import api from "@/utils/api";

export default function AllMeals({ meals }) {
    const [search, setSearch] = useState("");
    const [filteredMeals, setFilteredMeals] = useState(Array.isArray(meals) ? meals : []);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(api(`meals?title=${encodeURIComponent(search)}`));
            const data = await res.json();
            setFilteredMeals(Array.isArray(data) ? data : []);
        } catch (error) {
            setFilteredMeals([]);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>All Meals</h2>
            <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search meals by title"
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>Search</button>
            </form>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableHeaderRow}>
                            <th className={styles.tableHeaderCell}>Title</th>
                            <th className={styles.tableHeaderCell}>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMeals.length === 0 ? (
                            <tr>
                                <td colSpan={2} className={styles.tableCell}>
                                    No meals found.
                                </td>
                            </tr>
                        ) : (
                            filteredMeals.map((meal) => (
                                <tr key={meal.id} className={styles.tableRow}>
                                    <td className={styles.tableCell}>
                                        <Link href={`/meals/${meal.id}`} className={styles.mealLink}>
                                            {meal.title}
                                        </Link>
                                    </td>
                                    <td className={styles.tableCell}>{meal.description}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}