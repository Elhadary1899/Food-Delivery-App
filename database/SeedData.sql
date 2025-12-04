-- =================================================
-- USERS
-- =================================================
INSERT INTO Users (username, email, password, PhoneNumber, marketing_opt, role)
VALUES
('lara_whitley',     'lara.whitley@gmail.com',     'pass123',  '01012345678', TRUE,  'User'),
('omar_hassan',      'omar.hassan@gmail.com',      'pass124',  '01123456789', TRUE,  'User'),
('nourhan_hamada',   'nourhan.hamada@gmail.com',   'pass125',  '01234567890', TRUE,  'Admin'),
('ahmed_samir',      'ahmed.samir@gmail.com',      'pass126',  '01598765432', TRUE,  'User'),
('sara_khaled',      'sara.khaled@gmail.com',      'pass127',  '01087654321', FALSE, 'User'),
('mohamed_adel',     'mohamed.adel@gmail.com',     'pass128',  '01156789012', TRUE,  'User'),
('mira_soliman',     'mira.soliman@gmail.com',     'pass129',  '01267890123', TRUE,  'User'),
('hassan_ali',       'hassan.ali@gmail.com',       'pass120',  '01512349876', TRUE,  'User'),
('fatma_hussein',    'fatma.hussein@gmail.com',    'pass1223', '01099887766', FALSE, 'User'),
('john_smith',       'john.smith@gmail.com',       'pass1123', '01144556677', TRUE,  'User'),
('david_jackson',    'david.jackson@gmail.com',    'pass1323', '01255667788', FALSE, 'User'),
('emily_clark',      'emily.clark@gmail.com',      'pass1243', '01566778899', TRUE,  'User'),
('jennifer_brown',   'jennifer.brown@gmail.com',   'pass1283', '01011223344', TRUE,  'User'),
('youssef_fathy',    'youssef.fathy@gmail.com',    'pass1203', '01177889900', TRUE,  'User'),
('mariam_gamal',     'mariam.gamal@gmail.com',     'pass1243', '01244332211', FALSE, 'User'),
('alaa_ismail',      'alaa.ismail@gmail.com',      'pass1623', '01533445566', TRUE,  'User'),
('habiba_adel',      'habiba.adel@gmail.com',      'pass1723', '01055664433', TRUE,  'User'),
('tarek_mostafa',    'tarek.mostafa@gmail.com',    'pass1123', '01122334455', TRUE,  'User'),
('jana_samir',       'jana.samir@gmail.com',       'pass1223', '01299887755', FALSE, 'User'),
('kareem_rashad',    'kareem.rashad@gmail.com',    'pass1293', '01511220033', TRUE,  'User');

-- =================================================
-- SHIPPING ADDRESSES 
-- =================================================
INSERT INTO ShippingAddress (UserID, AddressName, Address, PostalCode, City, Country)
VALUES
(1,  'Home',   '12 Garden Street',        '11511', 'Cairo', 'Egypt'),
(2,  'Home',   '45 Nile Avenue',          '11321', 'Giza', 'Egypt'),
(3,  'Home',   '10 Freedom Road',         '11765', 'Cairo', 'Egypt'),
(4,  'Home',   '88 Tahrir Square',        '11522', 'Giza', 'Egypt'),
(5,  'Home',   '22 Palm Towers',          '11330', 'Alexandria', 'Egypt'),
(6,  'Home',   '9 Lotus Compound',        '11444', 'Cairo', 'Egypt'),
(7,  'Home',   '55 Horizon City',         '11566', 'Cairo', 'Egypt'),
(8,  'Home',   '19 Corniche Rd',          '21111', 'Alexandria', 'Egypt'),
(9,  'Home',   '77 Mountain View',        '11355', 'Cairo', 'Egypt'),
(10, 'Home',   '5 Green Park',            '11499', 'Cairo', 'Egypt'),
(11, 'Office', '101 Lake View',           '11821', 'Giza', 'Egypt'),
(12, 'Office', '4 Sunset Valley',         '11402', 'Cairo', 'Egypt'),
(13, 'Office', '16 West Hills',           '11378', 'Alexandria', 'Egypt'),
(14, 'Office', '88 Sunrise District',     '11588', 'Cairo', 'Egypt'),
(15, 'Office', '33 Blue River',           '11900', 'Cairo', 'Egypt'),
(16, 'Office', '120 Island Road',         '11392', 'Giza', 'Egypt'),
(17, 'Office', '6 Marina Bay',            '21122', 'Alexandria', 'Egypt'),
(18, 'Office', '44 Ocean Drive',          '11470', 'Cairo', 'Egypt'),
(19, 'Office', '7 Maple Town',            '11360', 'Giza', 'Egypt'),
(20, 'Office', '11 Silver Heights',       '11380', 'Cairo', 'Egypt');

-- =================================================
-- PAYMENT METHODS
-- =================================================
INSERT INTO Payment (UserID, PaymentName, PaymentMethod, CardholderName, CardNumber, ExpirationDate, CVC)
VALUES
-- Cash payments
(1,  'Cash Payment', 'Cash', NULL, NULL, NULL, NULL),
(2,  'Cash Payment', 'Cash', NULL, NULL, NULL, NULL),
(3,  'Cash Payment', 'Cash', NULL, NULL, NULL, NULL),
(4,  'Cash Payment', 'Cash', NULL, NULL, NULL, NULL),
(5,  'Cash Payment', 'Cash', NULL, NULL, NULL, NULL),
(6,  'Cash Payment', 'Cash', NULL, NULL, NULL, NULL),
(7,  'Cash Payment', 'Cash', NULL, NULL, NULL, NULL),
(8,  'Cash Payment', 'Cash', NULL, NULL, NULL, NULL),
(9,  'Cash Payment', 'Cash', NULL, NULL, NULL, NULL),
(10, 'Cash Payment', 'Cash', NULL, NULL, NULL, NULL),

-- Cards
(11, 'John Smith Card',      'Credit', 'John Smith',        '4111111111111111', '2027-08-01', '123'),
(12, 'David Jackson Card',   'Debit',  'David Jackson',     '5500000000000004', '2026-11-01', '456'),
(13, 'Emily Clark Card',     'Credit', 'Emily Clark',       '4007000000027',    '2028-02-01', '789'),
(14, 'Jennifer Brown Card',  'Credit', 'Jennifer Brown',    '6011000990139424', '2026-06-01', '321'),
(15, 'Youssef Fathy Card',   'Debit',  'Youssef Fathy',     '3530111333300000', '2027-09-01', '654'),
(16, 'Mariam Gamal Card',    'Credit', 'Mariam Gamal',      '4000056655665556', '2029-03-01', '987'),
(17, 'Alaa Ismail Card',     'Debit',  'Alaa Ismail',       '5105105105105100', '2026-12-01', '147'),
(18, 'Habiba Adel Card',     'Credit', 'Habiba Adel',       '4111111111111129', '2028-07-01', '258'),
(19, 'Tarek Mostafa Card',   'Debit',  'Tarek Mostafa',     '6011111111111117', '2027-01-01', '369'),
(20, 'Jana Samir Card',      'Credit', 'Jana Samir',        '3566002020360505', '2029-10-01', '159');

-- NEW UI testing methods
INSERT INTO Payment (UserID, PaymentName, PaymentMethod, CardholderName, CardNumber, ExpirationDate, CVC)
VALUES
(1, 'PayPal Wallet', 'PayPal', NULL, NULL, NULL, NULL),
(2, 'Visa Card',     'Visa',  'Visa User', '4111111111111111', '2028-12-01', '222'),
(3, 'MasterCard',    'MasterCard', 'MC User', '5555444433331111', '2028-11-01', '333');

-- =================================================
-- FOOD CATEGORIES
-- =================================================
INSERT INTO FoodCategory (CategoryName, ImageURL)
VALUES
('Burger', 'frontend/resources/pngtree-burger-and-fries-ai-generated-png-image_14563042.png'),
('Pizza', 'frontend/resources/Pepperoni-pizza-on-a-white-background-top-view-for-menu-royalty-free-stock-photo-removebg-preview.png'),
('Meat Grill', 'frontend/resources/photo_2025-12-02_16-43-35.jpg'),
('Fried Chicken', 'frontend/resources/fried chicken category.jpg'),
('Dessert', 'frontend/resources/Elemento-3-D-Bolo-no-Prato-PNG-Transparente-removebg-preview.png'),
('Sushi','frontend/resources/download-49-removebg-preview.png');

-- =================================================
-- RESTAURANTS
-- =================================================
INSERT INTO Restaurant (RestaurantName, RestaurantRating, Address, imageURL)
VALUES
('Holmes', 4.5, '12 Garden Street, Cairo', 'frontend/resources/Screenshot%202025-12-02%20170053.png?raw=true'),
('Pizza Hut', 4.7, '45 Nile Avenue, Giza', 'frontend/resources/pizza.jpg'),
("Little E's", 4.3, '10 Freedom Road, Cairo', 'frontend/resources/little.jpg'),
('5 Roosters', 4.6, '19 Lotus Compound, Cairo', 'frontend/resources/5%20roosters.jpg'),
('Coff', 4.2, '9 Lotus Compound, Cairo', 'frontend/resources/coff.jpg?raw=true'),
('The Wok Restaurant', 4.4, '88 Tahrir Square, Giza', 'https://ibb.co/mrTqphqq');

-- =================================================
-- FOOD ITEMS
-- =================================================
INSERT INTO FoodItems (CategoryID, RestaurantID, ItemName, ItemDescription, Price, imageURL)
VALUES
(1, 1, 'Classic Beef Burger', 'Beef patty, cheese, lettuce, tomato', 85.00, 'frontend/resources/Batatas-Fritas-E-Hamb-rguer-PNG-Comida-Comida-R-pida-Comida-N-o-Saud-vel-PNG-Imagem-para-download-gr.jpg'),
(2, 2, 'Pepperoni Pizza', 'Tomato, mozzarella, basil', 120.00, 'frontend/resources/Pepperoni-pizza-on-a-white-background-top-view-for-menu-royalty-free-stock-photo-removebg-preview.png'),
(3, 3, 'Mixed Grill Platter', 'Lamb chops, chicken, kofta', 180.00, 'frontend/resources/mix grill.jpg'),
(4, 4, 'Fried Chicken (6 pcs)', 'Buttermilk marinated & fried', 95.00, 'frontend/resources/fried-chicken-food-png-image-11667430104zzejscquxz.png'),
(5, 5, 'Chocolate Lava Cake', 'Warm cake with molten center', 60.00, 'frontend/resources/22g242_1200x1200.webp'),
(6, 6, 'Salmon Roll (8 pcs)', 'Salmon, rice, nori', 140.00, 'frontend/resources/Screenshot-2025-11-21-191851-removebg-preview.png');

-- =================================================
-- ORDERS (STATIC + TRACKING ORDERS)
-- =================================================
INSERT INTO Orders (UserID, OrderDate, TotalAccount, DeliveryFee, ShippingAddressID, PaymentID, OrderStatus)
VALUES
(1, '2025-02-01 14:30:00', 220.00, 15.00, 1, 1, 'Delivered'),
(2, '2025-02-02 18:20:00', 140.00, 20.00, 2, 2, 'Delivered'),
(3, '2025-03-05 12:10:00', 290.00, 15.00, 3, 3, 'Cancelled'),
(4, '2025-03-07 20:45:00', 110.00, 15.00, 4, 4, 'Delivered'),
(5, '2025-04-10 13:25:00', 210.00, 10.00, 5, 5, 'Delivered'),
(6, '2025-04-12 19:00:00', 160.00, 20.00, 6, 6, 'Being Prepared'),
(7, '2025-05-01 17:30:00', 245.00, 15.00, 7, 7, 'Pending'),
(8, '2025-05-03 08:15:00', 80.00, 10.00, 8, 8, 'Delivered'),
(9, '2025-06-21 12:50:00', 125.00, 10.00, 9, 9, 'Delivered'),
(10, '2025-06-25 21:05:00', 90.00, 15.00, 10, 10, 'Cancelled'),
(11, '2025-07-04 14:00:00', 135.00, 15.00, 11, 11, 'Delivered'),
(12, '2025-07-10 15:30:00', 65.00, 10.00, 12, 12, 'Delivered'),
(13, '2025-08-01 13:10:00', 105.00, 10.00, 13, 13, 'Delivered'),
(14, '2025-08-12 19:40:00', 57.00, 12.00, 14, 14, 'Cancelled'),
(15, '2025-09-18 18:20:00', 210.00, 15.00, 15, 15, 'Delivered'),
(16, '2025-09-20 11:05:00', 100.00, 15.00, 16, 16, 'Being Prepared'),
(17, '2025-10-02 09:30:00', 75.00, 10.00, 17, 17, 'Pending'),
(18, '2025-10-05 10:40:00', 40.00, 10.00, 18, 18, 'Delivered'),
(19, '2025-11-03 20:10:00', 167.00, 12.00, 19, 19, 'Delivered'),
(20, '2025-11-15 16:00:00', 105.00, 15.00, 20, 20, 'Delivered'),

-- Tracking test orders
(1, NOW(), 150.00, 15.00, 1, 1, 'Pending'),
(1, DATE_SUB(NOW(), INTERVAL 35 SECOND), 220.00, 10.00, 1, 1, 'Being Prepared'),
(2, DATE_SUB(NOW(), INTERVAL 70 SECOND), 180.00, 20.00, 2, 2, 'On The Way'),
(3, DATE_SUB(NOW(), INTERVAL 2 HOUR), 85.00, 10.00, 3, 3, 'Delivered'),
(4, DATE_SUB(NOW(), INTERVAL 1 DAY), 95.00, 15.00, 4, 4, 'Cancelled');

-- =================================================
-- ORDER ITEMS
-- =================================================
INSERT INTO OrderItems (OrderID, ItemID, Quantity, Price)
VALUES
(1, 1, 1, 85.00),
(1, 2, 1, 120.00),
(2, 2, 1, 120.00),
(3, 3, 1, 180.00),
(3, 4, 1, 95.00),
(4, 4, 1, 95.00),
(5, 5, 1, 60.00),
(5, 6, 1, 140.00),
(6, 6, 1, 140.00),

-- New tracking items
(21, 1, 2, 85.00),
(22, 2, 1, 120.00),
(23, 3, 1, 180.00),
(24, 4, 1, 95.00),
(25, 2, 1, 120.00);

-- =================================================
-- ORDER STATUS HISTORY
-- =================================================
INSERT INTO OrderStatusHistory (OrderID, Status, Timestamp)
VALUES
(21, 'Placed', NOW()),
(22, 'Placed', DATE_SUB(NOW(), INTERVAL 40 SECOND)),
(22, 'Preparing', DATE_SUB(NOW(), INTERVAL 35 SECOND)),
(23, 'Placed', DATE_SUB(NOW(), INTERVAL 90 SECOND)),
(23, 'Preparing', DATE_SUB(NOW(), INTERVAL 80 SECOND)),
(23, 'On The Way', DATE_SUB(NOW(), INTERVAL 70 SECOND)),
(24, 'Placed', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(24, 'Preparing', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(24, 'On The Way', DATE_SUB(NOW(), INTERVAL 110 MINUTE)),
(24, 'Delivered', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(25, 'Placed', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(25, 'Preparing', DATE_SUB(NOW(), INTERVAL 23 HOUR)),
(25, 'Cancelled', DATE_SUB(NOW(), INTERVAL 22 HOUR));

-- =================================================
-- REVIEWS
-- =================================================
INSERT INTO Reviews (UserID, ItemID, Rating, Review)
VALUES
(1, 1, 5, 'Excellent burger — juicy and well seasoned.'),
(2, 2, 4, 'Nice pizza, crust could be crispier.'),
(3, 3, 5, 'Great mixed grill platter, very flavorful.'),
(4, 4, 4, 'Chicken was crispy but a little salty.'),
(5, 5, 5, 'Lava cake was gooey and perfect.'),
(6, 6, 5, 'Fresh salmon rolls, well balanced.');

-- =================================================
-- CART
-- =================================================
INSERT INTO Cart (UserID, Cart_date)
VALUES
(1, '2025-11-25'), (2, '2025-11-25'), (3, '2025-11-25'),
(4, '2025-11-26'), (5, '2025-11-26'), (6, '2025-11-26'),
(7, '2025-11-27'), (8, '2025-11-27'), (9, '2025-11-27'),
(10,'2025-11-28'), (11,'2025-11-28'), (12,'2025-11-28'),
(13,'2025-11-29'), (14,'2025-11-29'), (15,'2025-11-29'),
(16,'2025-11-30'), (17,'2025-11-30'), (18,'2025-11-30'),
(19,'2025-11-30'), (20,'2025-11-30');

-- =================================================
-- CART ITEMS
-- =================================================
INSERT INTO CartItems (CartID, ItemID, Price, Quantity, Size)
VALUES
(1, 1, 85.00, 1, 'Regular'),
(2, 2, 120.50, 1, 'Large'),
(3, 3, 180.00, 1, 'Family'),
(4, 4, 95.00, 2, 'Regular'),
(5, 5, 60.00, 1, 'Single'),
(6, 6, 140.00, 1, '8 pcs');

-- =================================================
-- COUPONS
-- =================================================
INSERT INTO Coupons (UserID, CouponCode, DiscountAmount, DiscountType, ExpiryDate, IsUsed)
VALUES
(1, 'SAVE55', 55.00, 'Fixed', '2025-12-05', FALSE),
(1, 'SAVE40', 40.00, 'Fixed', '2025-12-05', FALSE),
(1, 'SAVE20', 20.00, 'Fixed', '2025-12-05', FALSE);