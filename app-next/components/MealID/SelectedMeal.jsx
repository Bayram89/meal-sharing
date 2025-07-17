"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, MapPin, Calendar, DollarSign } from 'lucide-react';
import styles from './SelectedMeal.module.css';
import api from '@/utils/api';

export default function SelectedMeal({ meal }) {
  const [form, setForm] = useState({
    contact_phonenumber: "",
    contact_name: "",
    contact_email: "",
  });
  const [loading, setLoading] = useState(false);

  if (!meal) return <div>No meal selected.</div>;

  const availableReservations = meal.max_reservations - meal.reservationCount;
  const hasAvailableReservations = availableReservations > 0;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(api("reservations"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meal_id: meal.id,
          ...form,
        }),
      });
      if (res.ok) {
        alert("Reservation successful!");
        setForm({
          contact_phonenumber: "",
          contact_name: "",
          contact_email: "",
        });
      } else {
        alert("Reservation failed. Please try again.");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/meals" className={styles.backButton}>
            <ArrowLeft className={styles.backIcon} />
            Back to All Meals
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mealContainer}>
          <div className={styles.imageSection}>
            <img
              src={meal.image}
              alt={meal.title}
              className={styles.mealImage}
            />
            <div className={styles.priceBadge}>
              <DollarSign className={styles.priceIcon} />
              {meal.price}
            </div>
          </div>

          <div className={styles.contentSection}>
            <div className={styles.mealHeader}>
              <h1 className={styles.mealTitle}>{meal.title}</h1>
              <div className={styles.spotsBadge}>
                {availableReservations} of {meal.max_reservations} spots available
              </div>
            </div>

            <p className={styles.mealDescription}>{meal.description}</p>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <Calendar className={styles.detailIcon} />
                <div className={styles.detailContent}>
                  <span className={styles.detailLabel}>Date</span>
                  <span className={styles.detailValue}>{formatDate(meal.when)}</span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <Clock className={styles.detailIcon} />
                <div className={styles.detailContent}>
                  <span className={styles.detailLabel}>Time</span>
                  <span className={styles.detailValue}>{formatTime(meal.when)}</span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <MapPin className={styles.detailIcon} />
                <div className={styles.detailContent}>
                  <span className={styles.detailLabel}>Location</span>
                  <span className={styles.detailValue}>{meal.location}</span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <Users className={styles.detailIcon} />
                <div className={styles.detailContent}>
                  <span className={styles.detailLabel}>Capacity</span>
                  <span className={styles.detailValue}>{meal.max_reservations} people</span>
                </div>
              </div>
            </div>

            {hasAvailableReservations ? (
              <form onSubmit={handleSubmit} className={styles.reservationForm}>
                <h3 className={styles.formTitle}>Make a Reservation</h3>
                
                <div className={styles.formGroup}>
                  <label htmlFor="contact_name" className={styles.formLabel}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="contact_name"
                    name="contact_name"
                    value={form.contact_name}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="contact_email" className={styles.formLabel}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="contact_email"
                    name="contact_email"
                    value={form.contact_email}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                    placeholder="Enter your email address"
                  />
                <div className={styles.formGroup}>
                  <label htmlFor="contact_phonenumber" className={styles.formLabel}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="contact_phonenumber"
                    name="contact_phonenumber"
                    value={form.contact_phonenumber}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                    placeholder="Enter your phone number"
                  />
                </div>
                </div>
                <div className={styles.actionSection}>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={styles.reserveButton}
                  >
                    {loading ? 'Processing...' : 'Reserve Your Spot'}
                  </button>
                  <button type="button" className={styles.shareButton}>
                    Share Event
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.soldOutSection}>
                <h3 className={styles.soldOutTitle}>Event Fully Booked</h3>
                <p className={styles.soldOutText}>
                  Unfortunately, this event is fully booked. Check back later for availability.
                </p>
                <button className={styles.shareButton}>
                  Share Event
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
