import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    CardActionArea,
    CircularProgress,
    Box,
} from "@mui/material";

export default function MealsPage() {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3001/api/meals")
            .then((res) => res.json())
            .then((data) => {
                setMeals(data);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                All Meals
            </Typography>
            <Grid container spacing={3}>
                {meals.map((meal) => (
                    <Grid item xs={12} sm={6} md={4} key={meal.id}>
                        <Link href={`/meals/${meal.id}`} passHref legacyBehavior>
                            <CardActionArea component="a">
                                <Card>
                                    {meal.image_url && (
                                        <CardMedia
                                            component="img"
                                            height="180"
                                            image={meal.image_url}
                                            alt={meal.title}
                                        />
                                    )}
                                    <CardContent>
                                        <Typography variant="h6">{meal.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {meal.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </CardActionArea>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}