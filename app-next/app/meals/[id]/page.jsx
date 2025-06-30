import { useState } from "react";

async function fetchMeal(id) {
    const res = await fetch(`http://localhost:3000/api/meals/${id}`);
    if (!res.ok) throw new Error("Failed to fetch meal");
    return res.json();
}

async function createReservation(mealId, data) {
    const res = await fetch(`http://localhost:3000/api/meals/${mealId}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create reservation");
    return res.json();
}

export default async function MealPage({ params }) {
    const meal = await fetchMeal(params.id);

    return (
        <div>
            <h1>{meal.title}</h1>
            <p>{meal.description}</p>
            <p>
                <strong>Location:</strong> {meal.location}
            </p>
            <p>
                <strong>Price:</strong> ${meal.price}
            </p>
            <ReservationForm mealId={meal.id} />
        </div>
    );
}

function ReservationForm({ mealId }) {
    const [form, setForm] = useState({ name: "", phone: "", guests: 1 });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        try {
            await createReservation(mealId, form);
            setStatus("success");
            setForm({ name: "", phone: "", guests: 1 });
        } catch {
            setStatus("error");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <h2>Reserve a spot</h2>
            <div>
                <label>
                    Name:
                    <input name="name" value={form.name} onChange={handleChange} required />
                </label>
            </div>
            <div>
                <label>
                    Phone:
                    <input name="phone" value={form.phone} onChange={handleChange} required />
                </label>
            </div>
            <div>
                <label>
                    Guests:
                    <input
                        name="guests"
                        type="number"
                        min="1"
                        value={form.guests}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <button type="submit" disabled={status === "loading"}>
                Reserve
            </button>
            {status === "success" && <p>Reservation created!</p>}
            {status === "error" && <p>Failed to create reservation.</p>}
        </form>
    );
}