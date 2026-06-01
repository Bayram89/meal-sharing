CREATE DATABASE IF NOT EXISTS meal_sharing;
USE meal_sharing;

CREATE TABLE Meal (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    image VARCHAR(500),
    host_name VARCHAR(255),
    host_title VARCHAR(255),
    host_bio TEXT,
    host_tables_count INT,
    host_rating DECIMAL(3, 1),
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

INSERT INTO Meal (id, title, description, location, image, host_name, host_title, host_bio, host_tables_count, host_rating, `when`, max_reservations, price, created_date) VALUES
(1, 'Ember Table Supper', 'An intimate evening of fire-roasted small plates, candlelight, and the kind of table where strangers quickly start talking like friends.', 'Vesterbro, Copenhagen', '/featured-meals/img_1.webp', 'Anna Jensen', 'Supper club host and food writer', 'Anna hosts dramatic late-evening dinners built around open-fire flavors, soft lighting, and guests who want the night to feel memorable from the first course.', 4, 4.9, '2026-06-12 19:00:00', 14, 44.00, '2026-05-20'),
(2, 'Green Atelier Lunch', 'A bright lunch gathering built around crisp seasonal greens, slow conversation, and a table that feels calm from the moment you sit down.', 'Frederiksberg, Copenhagen', '/featured-meals/img_2.webp', 'Clara Madsen', 'Cafe owner and brunch host', 'Clara brings together creatives, freelancers, and weekend guests for beautifully paced daytime tables that feel fresh, thoughtful, and easy to join.', 7, 4.9, '2026-06-19 12:30:00', 12, 26.00, '2026-05-20'),
(3, 'Cloud Dessert Salon', 'A small dessert-first gathering for people who enjoy playful plating, good coffee, and conversations that feel a little unexpected.', 'Indre By, Copenhagen', '/featured-meals/img_3.webp', 'Freja Holm', 'Pastry chef and tasting host', 'Freja curates sweet tasting nights with a soft, boutique feel for guests who want a dinner plan that feels lighter, rarer, and worth dressing up for.', 4, 4.8, '2026-06-26 20:00:00', 10, 24.00, '2026-05-21'),
(4, 'Garden Citrus Table', 'A slow summer table with bright plates, shared starters, and a relaxed atmosphere made for people who enjoy lighter meals and easy company.', 'Osterbro, Copenhagen', '/featured-meals/img_4.webp', 'Maja Petersen', 'Seasonal cook and supper host', 'Maja hosts green, generous dinners shaped around seasonal produce and guests who prefer a softer, more intimate social setting.', 4, 4.8, '2026-07-05 18:00:00', 16, 29.00, '2026-05-21'),
(5, 'Silk Pasta Evening', 'Fresh handmade pasta, a smaller table, and a slower pace for guests who want the food and conversation to unfold naturally.', 'Christianshavn, Copenhagen', '/featured-meals/img_5.webp', 'Elena Rossi', 'Pasta teacher and supper host', 'Elena is known for beautifully composed pasta nights where the table feels warm, intimate, and quietly special without trying too hard.', 5, 4.9, '2026-07-17 19:30:00', 12, 38.00, '2026-05-22'),
(6, 'Chef''s Counter Filet Night', 'A polished hosted dinner with standout plating, a smaller guest list, and the kind of atmosphere that feels closer to a private chef''s table than a booking app.', 'Nordhavn, Copenhagen', '/featured-meals/img_66.webp', 'Mikkel Larsen', 'Private dining host', 'Mikkel hosts refined tasting-style evenings for guests who want restaurant-level presentation with the warmth and conversation of a hosted home table.', 6, 4.8, '2026-08-08 19:00:00', 10, 58.00, '2026-05-22'),
(7, 'Coastal Green Table', 'A vegetarian dinner built around shared plates, seasonal ingredients, and a welcoming group setting.', 'Osterbro, Copenhagen', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80', 'Maja Petersen', 'Seasonal cook and supper host', 'Maja curates vegetable-led dinners that feel generous, calm, and inclusive for guests meeting over food for the first time.', 4, 4.8, '2026-08-21 18:30:00', 18, 31.00, '2026-05-23'),
(8, 'Sourdough Pizza Night', 'Wood-fired pizza, easy conversation, and a neighborhood-style evening that feels more like joining friends than attending an event.', 'Amager, Copenhagen', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80', 'Luca Moretti', 'Neighborhood pizza host', 'Luca turns pizza night into a social ritual, with communal tables, shared slices, and guests who quickly start talking like regulars.', 9, 4.8, '2026-09-04 19:00:00', 22, 26.00, '2026-05-23'),
(9, 'Candlelit Curry Evening', 'A warm, intimate dinner with shared dishes and a softer atmosphere for people who want a slower night out.', 'Valby, Copenhagen', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1200&q=80', 'Fatima Ali', 'Home cook and host', 'Fatima creates quietly hosted evenings where the pace is slower, the room feels warm, and guests leave feeling they were genuinely looked after.', 6, 4.9, '2026-09-18 18:30:00', 16, 29.00, '2026-05-24'),
(10, 'Dessert Atelier', 'A small dessert-focused gathering where plated sweets, coffee, and conversation carry the whole evening.', 'Indre By, Copenhagen', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80', 'Freja Holm', 'Pastry chef and tasting host', 'Freja hosts intimate dessert nights for people who enjoy beautifully paced tasting menus and conversations that feel a little special.', 4, 4.8, '2026-10-02 20:00:00', 12, 22.00, '2026-05-24');

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
