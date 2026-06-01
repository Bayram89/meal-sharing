"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  Users,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Star,
} from "lucide-react";
import styles from "./SelectedMeal.module.css";
import api from "@/utils/api";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function SelectedMeal({ meal, reviews = [] }) {
  const [form, setForm] = useState({
    contact_phonenumber: "",
    contact_name: "",
    contact_email: "",
  });
  const [reviewForm, setReviewForm] = useState({
    title: "",
    description: "",
    stars: 5,
  });
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reservationStatus, setReservationStatus] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");

  if (!meal) {
    return (
      <div className={styles.emptyState}>
        <h1>This meal is unavailable</h1>
        <p>Please return to the listings and choose another hosted meal.</p>
      </div>
    );
  }

  const reservedSeats = Number(meal.reservationCount ?? 0);
  const availableReservations = Math.max(meal.max_reservations - reservedSeats, 0);
  const hasAvailableReservations = availableReservations > 0;
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + Number(review.stars || 0), 0) /
          reviews.length
        ).toFixed(1)
      : "5.0";
  const reviewSummaryLabel =
    reviews.length > 0
      ? `based on ${reviews.length} guest ${
          reviews.length === 1 ? "review" : "reviews"
        }`
      : "guest reviews start this season";
  const seatsLeftLabel =
    availableReservations === 1
      ? "1 seat left"
      : `${availableReservations} seats left`;
  const hostRating = Number(meal.host_rating ?? averageRating).toFixed(1);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReservationStatus("");

    try {
      const res = await fetch(api("reservations"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meal_id: meal.id,
          number_of_guests: 1,
          ...form,
        }),
      });

      if (!res.ok) {
        throw new Error("Reservation failed");
      }

      setReservationStatus("Your reservation request has been received.");
      setForm({
        contact_phonenumber: "",
        contact_name: "",
        contact_email: "",
      });
    } catch (error) {
      setReservationStatus("We could not save your reservation just now.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm({
      ...reviewForm,
      [name]: name === "stars" ? parseInt(value, 10) : value,
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewStatus("");

    try {
      const res = await fetch(api("reviews"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meal_id: meal.id,
          ...reviewForm,
        }),
      });

      if (!res.ok) {
        throw new Error("Review failed");
      }

      setReviewStatus("Thank you. Your review has been submitted.");
      setReviewForm({
        title: "",
        description: "",
        stars: 5,
      });
    } catch (error) {
      setReviewStatus("We could not submit your review just now.");
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className={styles.pageShell}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/meals" className={styles.backButton}>
            <ArrowLeft className={styles.backIcon} />
            Back to all meals
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mealContainer}>
          <div className={styles.imageSection}>
            <img src={meal.image} alt={meal.title} className={styles.mealImage} />
            <div className={styles.priceBadge}>
              <span className={styles.priceCurrency}>DKK</span>
              {meal.price}
            </div>
          </div>

          <div className={styles.contentSection}>
            <section className={styles.introSection}>
              <div className={styles.introCopy}>
                <p className={styles.eyebrow}>Real people. Real tables. Real conversations.</p>
                <h1 className={styles.mealTitle}>{meal.title}</h1>
                <p className={styles.hostLine}>Hosted by {meal.host_name}</p>
                <p className={styles.mealDescription}>{meal.description}</p>
              </div>

              <div className={styles.trustPanel}>
                <div className={styles.trustBadge}>
                  <ShieldCheck className={styles.trustIcon} />
                  Verified host
                </div>
                <div className={styles.trustStat}>
                  <span className={styles.trustValue}>{seatsLeftLabel}</span>
                  <span className={styles.trustLabel}>
                    {reservedSeats}/{meal.max_reservations} seats filled
                  </span>
                </div>
                <div className={styles.trustStat}>
                  <span className={styles.trustValue}>
                    <Star className={styles.starIcon} />
                    {averageRating}
                  </span>
                  <span className={styles.trustLabel}>{reviewSummaryLabel}</span>
                </div>
              </div>
            </section>

            <section className={styles.hostPanel}>
              <div className={styles.hostPanelHeader}>
                <p className={styles.hostEyebrow}>Hosted by</p>
                <h2 className={styles.hostName}>{meal.host_name}</h2>
              </div>
              <p className={styles.hostTitle}>{meal.host_title}</p>
              <p className={styles.hostBio}>{meal.host_bio}</p>

              <div className={styles.hostMetaRow}>
                <div className={styles.hostMetaCard}>
                  <span className={styles.hostMetaValue}>{meal.host_tables_count}</span>
                  <span className={styles.hostMetaLabel}>previous tables</span>
                </div>
                <div className={styles.hostMetaCard}>
                  <span className={styles.hostMetaValue}>{hostRating}</span>
                  <span className={styles.hostMetaLabel}>average host rating</span>
                </div>
              </div>
            </section>

            <section className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <CalendarDays className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Date</span>
                  <span className={styles.detailValue}>{formatDate(meal.when)}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Clock3 className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Time</span>
                  <span className={styles.detailValue}>{formatTime(meal.when)}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <MapPin className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Location</span>
                  <span className={styles.detailValue}>{meal.location}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Users className={styles.detailIcon} />
                <div>
                  <span className={styles.detailLabel}>Capacity</span>
                  <span className={styles.detailValue}>
                    {reservedSeats} reserved of {meal.max_reservations}
                  </span>
                </div>
              </div>
            </section>

            <section className={styles.formGrid}>
              {hasAvailableReservations ? (
                <form onSubmit={handleSubmit} className={styles.panel}>
                  <h2 className={styles.panelTitle}>Reserve a seat</h2>
                  <p className={styles.panelIntro}>
                    Share your details and save your place at {meal.host_name}'s
                    table.
                  </p>

                  <div className={styles.formGroup}>
                    <label htmlFor="contact_name" className={styles.formLabel}>
                      Full name
                    </label>
                    <input
                      type="text"
                      id="contact_name"
                      name="contact_name"
                      value={form.contact_name}
                      onChange={handleChange}
                      required
                      className={styles.formInput}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="contact_email" className={styles.formLabel}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="contact_email"
                      name="contact_email"
                      value={form.contact_email}
                      onChange={handleChange}
                      required
                      className={styles.formInput}
                      placeholder="name@example.com"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="contact_phonenumber" className={styles.formLabel}>
                      Phone number
                    </label>
                    <input
                      type="tel"
                      id="contact_phonenumber"
                      name="contact_phonenumber"
                      value={form.contact_phonenumber}
                      onChange={handleChange}
                      required
                      className={styles.formInput}
                      placeholder="Your phone number"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.primaryButton}
                  >
                    {loading ? "Sending request..." : "Reserve your seat"}
                  </button>

                  {reservationStatus ? (
                    <p className={styles.statusMessage}>{reservationStatus}</p>
                  ) : null}
                </form>
              ) : (
                <div className={styles.panel}>
                  <h2 className={styles.panelTitle}>Currently fully booked</h2>
                  <p className={styles.panelIntro}>
                    This event is full right now. Keep it on your list and check
                    back for openings or future hosting dates.
                  </p>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className={styles.panel}>
                <h2 className={styles.panelTitle}>Leave a review</h2>
                <p className={styles.panelIntro}>
                  Help future guests understand what the experience felt like in
                  practice.
                </p>

                <div className={styles.formGroup}>
                  <label htmlFor="review_title" className={styles.formLabel}>
                    Review title
                  </label>
                  <input
                    type="text"
                    id="review_title"
                    name="title"
                    value={reviewForm.title}
                    onChange={handleReviewChange}
                    required
                    className={styles.formInput}
                    placeholder="A short summary"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="review_description" className={styles.formLabel}>
                    Review
                  </label>
                  <textarea
                    id="review_description"
                    name="description"
                    value={reviewForm.description}
                    onChange={handleReviewChange}
                    required
                    rows={5}
                    className={styles.formTextarea}
                    placeholder="Share what made the evening memorable"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="review_stars" className={styles.formLabel}>
                    Rating
                  </label>
                  <select
                    id="review_stars"
                    name="stars"
                    value={reviewForm.stars}
                    onChange={handleReviewChange}
                    required
                    className={styles.formSelect}
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very good</option>
                    <option value={3}>3 - Good</option>
                    <option value={2}>2 - Fair</option>
                    <option value={1}>1 - Poor</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className={styles.secondaryButton}
                >
                  {reviewLoading ? "Submitting..." : "Submit review"}
                </button>

                {reviewStatus ? (
                  <p className={styles.statusMessage}>{reviewStatus}</p>
                ) : null}
              </form>
            </section>

            {reviews.length > 0 ? (
              <section className={styles.reviewSection}>
                <div className={styles.reviewSectionHeader}>
                  <p className={styles.reviewEyebrow}>Guest notes</p>
                  <h2 className={styles.reviewTitle}>
                    What people say after the table ends
                  </h2>
                </div>

                <div className={styles.reviewGrid}>
                  {reviews.slice(0, 3).map((review) => (
                    <article key={review.id} className={styles.reviewCard}>
                      <div className={styles.reviewStars}>
                        <Star className={styles.starIcon} />
                        <span>{review.stars}.0</span>
                      </div>
                      <h3 className={styles.reviewCardTitle}>{review.title}</h3>
                      <p className={styles.reviewCardText}>{review.description}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
