'use client';

import React, { useState } from 'react';
import styles from './SelectedMeal.module.css';

const SelectedMeal = ({ meal }) => {
    const [form, setForm] = useState({ phonenumber: '', name: '', email: '' });
    const [loading, setLoading] = useState(false);

    if (!meal) return <div>No meal selected.</div>;

    const hasAvailableReservations = meal.max_reservations > meal.reservationCount;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    meal_id: meal.id,
                    ...form,
                }),
            });
            if (res.ok) {
                alert('Reservation successful!');
                setForm({ phonenumber: '', name: '', email: '' });
            } else {
                alert('Reservation failed. Please try again.');
            }
        } catch (err) {
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{meal.name}</h2>
            <p className={styles.description}>{meal.description}</p>
            {hasAvailableReservations ? (
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phonenumber"
                            value={form.phonenumber}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.button}
                    >
                        {loading ? 'Booking...' : 'Book seat'}
                    </button>
                </form>
            ) : (
                <div className={styles.noReservations}>
                    No available reservations for this meal.
                </div>
            )}
        </div>
    );
};

export default SelectedMeal;