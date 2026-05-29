CREATE DATABASE IF NOT EXISTS meal_sharing;
USE meal_sharing;

CREATE TABLE Meal (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    image VARCHAR(500),
    `when` DATETIME NOT NULL,
    max_reservations INT,
    price DECIMAL(10, 2),
    created_date DATE
);

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

CREATE TABLE Review (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    meal_id INT,
    stars INT,
    created_date DATE,
    FOREIGN KEY (meal_id) REFERENCES Meal(id)
);

INSERT INTO Meal (id, title, description, location, image, `when`, max_reservations, price, created_date) VALUES
(1, 'Nordic Supper Club', 'A six-course seasonal tasting menu with rye crisps, smoked butter, and candlelit communal tables.', 'Vesterbro, Copenhagen', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80', '2026-06-12 19:00:00', 16, 42.00, '2026-05-20'),
(2, 'Harbor Seafood Night', 'Fresh oysters, grilled cod, and lemon herb potatoes inspired by the Copenhagen waterfront.', 'Nordhavn, Copenhagen', 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80', '2026-06-19 18:30:00', 18, 48.00, '2026-05-20'),
(3, 'Rooftop Taco Social', 'Slow-cooked beef tacos, charred corn, and bright salsas served with skyline views and music.', 'Norrebro, Copenhagen', 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=1200&q=80', '2026-06-26 19:30:00', 24, 24.00, '2026-05-21'),
(4, 'Garden Brunch Feast', 'An elegant weekend brunch with shakshuka, cardamom buns, fresh berries, and pour-over coffee.', 'Frederiksberg, Copenhagen', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80', '2026-07-05 11:00:00', 20, 28.00, '2026-05-21'),
(5, 'Fire & Smoke BBQ Night', 'Oak-smoked brisket, grilled vegetables, and house pickles served family-style at long wooden tables.', 'Refshaleoen, Copenhagen', 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1200&q=80', '2026-07-17 18:00:00', 30, 36.00, '2026-05-22'),
(6, 'Pasta & Natural Wine', 'Handmade tagliatelle, slow braised mushroom ragu, and a relaxed natural wine pairing.', 'Christianshavn, Copenhagen', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80', '2026-08-08 19:00:00', 14, 34.00, '2026-05-22'),
(7, 'Coastal Green Table', 'A refined vegetarian dinner with grilled courgettes, whipped feta, herbs, and summer greens.', 'Osterbro, Copenhagen', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80', '2026-08-21 18:30:00', 18, 31.00, '2026-05-23'),
(8, 'Sourdough Pizza Night', 'Wood-fired pizzas, burrata, and crisp salads in a cozy neighborhood studio kitchen.', 'Amager, Copenhagen', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80', '2026-09-04 19:00:00', 22, 26.00, '2026-05-23'),
(9, 'Candlelit Curry Evening', 'Fragrant coconut curry, warm flatbread, and spiced rice served in an intimate home setting.', 'Valby, Copenhagen', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80', '2026-09-18 18:30:00', 16, 29.00, '2026-05-24'),
(10, 'Dessert Atelier', 'A plated dessert experience featuring citrus tart, dark chocolate mousse, and espresso service.', 'Indre By, Copenhagen', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80', '2026-10-02 20:00:00', 12, 22.00, '2026-05-24');

INSERT INTO Reservation (id, number_of_guests, meal_id, created_date, contact_phonenumber, contact_name, contact_email) VALUES
(1, 2, 1, '2026-05-25', '20112233', 'Sofia Jensen', 'sofia.jensen@example.com'),
(2, 4, 2, '2026-05-26', '22114455', 'Noah Larsen', 'noah.larsen@example.com'),
(3, 3, 3, '2026-05-26', '33115566', 'Emma Nielsen', 'emma.nielsen@example.com'),
(4, 2, 6, '2026-05-27', '44116677', 'Oliver Hansen', 'oliver.hansen@example.com'),
(5, 5, 8, '2026-05-28', '55117788', 'Clara Madsen', 'clara.madsen@example.com');

INSERT INTO Review (id, title, description, meal_id, stars, created_date) VALUES
(1, 'Beautiful evening', 'Warm hosting, thoughtful plating, and a menu that felt genuinely memorable from start to finish.', 1, 5, '2026-05-25'),
(2, 'Fresh and polished', 'The seafood was excellent and the setting made it feel like a small private restaurant by the harbor.', 2, 5, '2026-05-25'),
(3, 'Fun atmosphere', 'Relaxed, social, and full of flavor. This is the kind of dinner you want to bring friends to.', 3, 4, '2026-05-26'),
(4, 'Brunch done right', 'Everything looked great on the table and the cardamom buns were the highlight of the morning.', 4, 5, '2026-05-26'),
(5, 'Excellent comfort food', 'Generous portions, great smoke flavor, and a host who clearly enjoys creating a full experience.', 5, 5, '2026-05-27'),
(6, 'Cozy and elegant', 'The pasta was silky, the wine pairing worked beautifully, and the whole evening felt easy and refined.', 6, 5, '2026-05-27'),
(7, 'Creative vegetarian menu', 'Fresh, vibrant, and much more exciting than a standard vegetarian dinner.', 7, 4, '2026-05-28'),
(8, 'Neighborhood favorite', 'Crisp crust, good music, and an atmosphere that felt welcoming from the moment we arrived.', 8, 5, '2026-05-28'),
(9, 'Full of warmth', 'The curry had real depth and the candlelit setup made the dinner feel especially thoughtful.', 9, 5, '2026-05-28'),
(10, 'Perfect ending to the week', 'A small, stylish dessert event with strong coffee and beautifully balanced sweets.', 10, 5, '2026-05-29');
