CREATE DATABASE IF NOT EXISTS meal_sharing;
USE meal_sharing;

# Meals Table
CREATE TABLE Meal (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    `when` DATETIME NOT NULL,
    max_reservations INT,
    price DECIMAL(10, 2),
    created_date DATE
);

# Create Reservation table
CREATE TABLE Reservation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    number_of_guests INT,
    meal_id INT,
    created_date DATE,
    contact_phonenumber VARCHAR(20),
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    FOREIGN KEY (meal_id) REFERENCES Meal(id)
);

# Create Review table
CREATE TABLE Review (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    meal_id INT,
    stars INT,
    created_date DATE,
    FOREIGN KEY (meal_id) REFERENCES Meal(id)
);

USE meal_sharing;

SELECT * FROM Reservation;

SELECT * FROM Review;

SELECT * FROM Meal;

# Queries about Meal table
INSERT INTO Meal (id, title, description, location, `when`, max_reservations, price, created_date) VALUES
(1, 'Pasta Night', 'Delicious Italian pasta dishes', 'Downtown Restaurant', '2023-10-01 19:00:00', 20, 15.99, '2023-09-20'),
(2, 'Sushi Feast', 'Fresh sushi and sashimi', 'Sakura Sushi Bar', '2023-10-02 18:30:00', 15, 25.50, '2023-09-21'),
(3, 'BBQ Party', 'Grilled meats and sides', 'Backyard BBQ Spot', '2023-10-03 17:00:00', 30, 20.00, '2023-09-22'),
(4, 'Vegan Delight', 'Plant-based gourmet meals', 'Green Earth Cafe', '2023-10-04 18:00:00', 25, 18.75, '2023-09-23'),
(5, 'Seafood Extravaganza', 'Fresh seafood platters', 'Ocean Breeze Restaurant', '2023-10-05 19:30:00', 20, 30.00, '2023-09-24'),
(6, 'Taco Tuesday', 'Authentic Mexican tacos', 'Taco Truck', '2023-10-06 19:00:00', 40, 12.50, '2023-09-25'),
(7, 'Indian Curry Night', 'Spicy Indian curries and naan', 'Curry House', '2023-10-07 18:00:00', 20, 22.00, '2023-09-26'),
(8, 'French Bistro Evening', 'Classic French dishes and wine', 'Paris Bistro', '2023-10-08 19:30:00', 15, 35.00, '2023-09-27');


SELECT * FROM Meal;

# Changing some of the meal data
UPDATE Meal
SET `when` = '2024-09-05 20:30:00'
WHERE id = 2;

UPDATE Meal
SET `when` = '2024-10-05 16:30:00'
WHERE id = 4;

UPDATE Meal
SET `when` = '2024-10-05 17:00:00'
WHERE id = 5;

SELECT * FROM Meal;

# Adding new meals
INSERT INTO Meal (title, description, location, `when`, max_reservations, price, created_date) VALUES
('Taco Tuesday', 'Authentic Mexican tacos', 'Taco Truck', '2023-10-06 19:00:00', 40, 12.50, '2023-09-25'),
('Indian Curry Night', 'Spicy Indian curries and naan', 'Curry House', '2023-10-07 18:00:00', 20, 22.00, '2023-09-26'),
('French Bistro Evening', 'Classic French dishes and wine', 'Paris Bistro', '2023-10-08 19:30:00', 15, 35.00, '2023-09-27');

INSERT INTO Meal (title, description, location, `when`, max_reservations, price, created_date) VALUES
('Doner Kebab Night', 'Delicious doner kebabs and sides', 'Kebab House', '2026-10-09 18:00:00', 30, 10.00, '2025-09-28'),
('Pizza Party', 'Variety of pizzas and drinks', 'Pizza Place', '2027-10-10 19:00:00', 25, 15.00, '2025-09-29'),
('Burger Bash', 'Juicy burgers and fries', 'Burger Joint', '2028-10-11 18:30:00', 20, 12.00, '2025-09-30'),
('Salad Bar', 'Fresh salads and dressings', 'Healthy Eats', '2029-10-12 19:00:00', 15, 8.50, '2025-10-01'),
('Dessert Night', 'Assorted desserts and pastries', 'Sweet Tooth Bakery', '2030-10-13 18:00:00', 10, 5.00, '2025-10-02');


# Getting a meal with id 5
SELECT title
FROM Meal
WHERE id = 5;

# Updating a meal with id 7
UPDATE Meal
SET title = 'Updated Indian Curry Night', description = 'Authentic Indian curries and naan bread'
WHERE id = 7;

# Reservation Table
SELECT * FROM Reservation;

INSERT INTO Reservation (number_of_guests, meal_id, created_date, contact_phonenumber, contact_name, contact_email)
VALUES 
(4, 1, '2023-09-30', '1234567890', 'John Doe', 'johndoe@example.com'),
(2, 2, '2023-09-30', '9876543210', 'Jane Smith', 'janesmith@example.com'),
(3, 3, '2023-09-30', '5551234567', 'Alice Johnson', 'alicejohnson@example.com'),
(5, 4, '2023-09-30', '4449876543', 'Bob Brown', 'bobbrown@example.com'),
(1, 5, '2023-09-30', '3335557777', 'Charlie White', 'charliewhite@example.com');

# Get a reservation with id 8
SELECT * 
FROM reservation
WHERE id = 8;

UPDATE reservation
SET number_of_guests = 6
WHERE id = 8;

# Review Table
SELECT * FROM Review;

INSERT INTO Review (title, description, meal_id, stars, created_date)
VALUES 
('Amazing Pasta Night', 'The pasta was delicious and the atmosphere was great!', 1, 5, '2023-09-30'),
('Sushi Heaven', 'Best sushi I have ever had!', 2, 4, '2023-09-30'),
('BBQ Bliss', 'The BBQ was fantastic, loved the grilled meats!', 3, 5, '2023-09-30'),
('Vegan Paradise', 'So many tasty vegan options!', 4, 4, '2023-09-30'),
('Seafood Delight', 'Fresh seafood and great service!', 5, 5, '2023-09-30'),
('Taco Fiesta', 'The tacos were authentic and flavorful!', 6, 5, '2023-09-30'),
('Curry Perfection', 'The curries were spicy and delicious!', 7, 5, '2023-09-30'),
('French Elegance', 'The French dishes were exquisite and paired well with wine!', 8, 5, '2023-09-30');

SELECT * FROM Review;

INSERT INTO Review (title, description, meal_id, stars, created_date)
VALUES 
('Taco Tuesday', 'Authentic Mexican tacos', 6, 5, '2023-09-30'),
('Indian Curry Night', 'Spicy Indian curries and naan', 7, 4, '2023-09-30'),
('French Bistro Evening', 'Classic French dishes and wine', 8, 5, '2023-09-30');

SELECT * FROM Review;


SELECT * FROM Review
WHERE meal_id = 11;

UPDATE Review
SET stars = 4
WHERE meal_id = 11;

SELECT * FROM Review;

UPDATE review
SET title = 'Updated Review Title', description = 'Updated review description'
WHERE id = 11;

SELECT * FROM Review;
SELECT * FROM Review
WHERE meal_id = 11;

# Meals that are relatively cheaper than the rest of the meals
SELECT *
FROM Meal
WHERE price < 20;

# Meals that has available reservations
SELECT *
FROM Meal
WHERE max_reservations > 0;

# Meals that are available in the next 30 days
# MEAL table that has 'night' word somewhere in the title
SELECT * 
FROM meal
WHERE title like '%Night%'

# eals that has two dates
SELECT *
FROM meal
WHERE `when` BETWEEN '2023-10-01' AND '2023-10-31';

SELECT *
FROM meal
LIMIT 11;

# Meals that have reviews
SELECT *
FROM review
WHERE stars > 1;

# Reservations with a certain meal and/or date
SELECT *
FROM reservation
WHERE meal_id = 1
ORDER BY created_date;

# Putting meals by date
SELECT *
FROM meal
ORDER BY `when` DESC;

# Putting meals by price
SELECT *
FROM meal
ORDER BY price DESC;

# Putting meals by title
SELECT *    
FROM meal
ORDER BY title ASC;

# Putting meals by location
SELECT *
FROM meal
ORDER BY location ASC;

# Putting meals by max_reservations
SELECT *
FROM meal
ORDER BY max_reservations DESC;

# Putting meals by stars
SELECT *
FROM review
ORDER BY stars DESC;

#Putting meals by avarage number of stars in the review table
SELECT meal_id, AVG(stars) AS average_stars
FROM review
GROUP BY meal_id
HAVING AVG(stars) > 3
ORDER BY average_stars DESC;

# Putting meals by number of reviews
SELECT meal_id, COUNT(*) AS number_of_reviews
FROM review
GROUP BY meal_id
HAVING COUNT(*) > 1
ORDER BY number_of_reviews DESC;