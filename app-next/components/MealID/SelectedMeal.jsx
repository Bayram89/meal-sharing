'use client';

import React from 'react';

const SelectedMeal = ({ meal }) => {
    if (!meal) return <div>No meal selected.</div>;

    return (
        <div>
            <h2>{meal.name}</h2>
            <p>{meal.description}</p>
        </div>
    );
};

export default SelectedMeal;