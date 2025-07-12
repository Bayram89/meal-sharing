"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./AllMeals.module.css";
import api from "@/utils/api";

const SORT_FIELDS = [
    { value: "price", label: "Price" },
    { value: "when", label: "When" },
    { value: "max_reservations", label: "Max Reservations" },
];

const SORT_DIRECTIONS = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
];

export default function AllMeals({ meals }) {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState("title");
    const [sortDir, setSortDir] = useState("asc");
    const [filteredMeals, setFilteredMeals] = useState(Array.isArray(meals) ? meals : []);

    const fetchMeals = async (searchValue, key, dir) => {
        try {
            const params = [
                searchValue ? `title=${encodeURIComponent(searchValue)}` : "",
                `sortKey=${encodeURIComponent(key)}`,
                `sortDir=${encodeURIComponent(dir)}`
            ].filter(Boolean).join("&");
            const res = await fetch(api(`meals?${params}`));
            const data = await res.json();
            setFilteredMeals(Array.isArray(data) ? data : []);
        } catch (error) {
            setFilteredMeals([]);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        fetchMeals(search, sortKey, sortDir);
    };

    const handleSortKeyChange = (e) => {
        const newSortKey = e.target.value;
        setSortKey(newSortKey);
        fetchMeals(search, newSortKey, sortDir);
    };

    const handleSortDirChange = (e) => {
        const newSortDir = e.target.value;
        setSortDir(newSortDir);
        fetchMeals(search, sortKey, newSortDir);
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
            <div className={styles.sortControls}>
                <label>
                    Sort by:&nbsp;
                    <select value={sortKey} onChange={handleSortKeyChange} className={styles.sortSelect}>
                        {SORT_FIELDS.map(field => (
                            <option key={field.value} value={field.value}>{field.label}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Direction:&nbsp;
                    <select value={sortDir} onChange={handleSortDirChange} className={styles.sortSelect}>
                        {SORT_DIRECTIONS.map(dir => (
                            <option key={dir.value} value={dir.value}>{dir.label}</option>
                        ))}
                    </select>
                </label>
            </div>
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