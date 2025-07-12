import React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import api from "@/utils/api";

export default async function MealsPage() {
    const res = await fetch(api("meals"), { cache: "no-store" });
    const meals = await res.json();

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>All Meals</h2>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableHeaderRow}>
                            <th className={styles.tableHeaderCell}>Title</th>
                            <th className={styles.tableHeaderCell}>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meals.map((meal) => (
                            <tr key={meal.id} className={styles.tableRow}>
                                <td className={styles.tableCell}>
                                    <Link href={`/meals/${meal.id}`} className={styles.mealLink}>
                                        {meal.title}
                                    </Link>
                                </td>
                                <td className={styles.tableCell}>{meal.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
