import React from "react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Avatar,
} from "@mui/material";

export default async function MealsPage() {
    const res = await fetch("http://localhost:3001/api/meals", { cache: "no-store" });
    const meals = await res.json();

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                All Meals
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {meals.map((meal) => (
                            <TableRow key={meal.id} hover>
                                <TableCell>
                                    <Link href={`/meals/${meal.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                        {meal.title}
                                    </Link>
                                </TableCell>
                                <TableCell>{meal.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
