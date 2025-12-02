INSERT  INTO Users (username, email, password, marketing_opt, role)
VALUES
('lara_whitley', 'lara.whitley@gmail.com', 'pass123', TRUE, 'User'),
('omar_hassan', 'omar.hassan@gmail.com', 'pass123', TRUE, 'User'),
('nourhan_hamada', 'nourhan.hamada@gmail.com', 'pass123', TRUE, 'Admin'),
('ahmed_samir', 'ahmed.samir@gmail.com', 'pass123', TRUE, 'User'),
('sara_khaled', 'sara.khaled@gmail.com', 'pass123', FALSE, 'User'),
('mohamed_adel', 'mohamed.adel@gmail.com', 'pass123', TRUE, 'User'),
('mira_soliman', 'mira.soliman@gmail.com', 'pass123', TRUE, 'User'),
('hassan_ali', 'hassan.ali@gmail.com', 'pass123', TRUE, 'User'),
('fatma_hussein', 'fatma.hussein@gmail.com', 'pass123', FALSE, 'User'),
('john_smith', 'john.smith@gmail.com', 'pass123', TRUE, 'User'),
('david_jackson', 'david.jackson@gmail.com', 'pass123', FALSE, 'User'),
('emily_clark', 'emily.clark@gmail.com', 'pass123', TRUE, 'User'),
('jennifer_brown', 'jennifer.brown@gmail.com', 'pass123', TRUE, 'User'),
('youssef_fathy', 'youssef.fathy@gmail.com', 'pass123', TRUE, 'User'),
('mariam_gamal', 'mariam.gamal@gmail.com', 'pass123', FALSE, 'User'),
('alaa_ismail', 'alaa.ismail@gmail.com', 'pass123', TRUE, 'User'),
('habiba_adel', 'habiba.adel@gmail.com', 'pass123', TRUE, 'User'),
('tarek_mostafa', 'tarek.mostafa@gmail.com', 'pass123', TRUE, 'User'),
('jana_samir', 'jana.samir@gmail.com', 'pass123', FALSE, 'User'),
('kareem_rashad', 'kareem.rashad@gmail.com', 'pass123', TRUE, 'User');

INSERT INTO ShippingAddress (UserID, Address, PostalCode, City, Country)
VALUES
(1, '12 Garden Street', '11511', 'Cairo', 'Egypt'),
(2, '45 Nile Avenue', '11321', 'Giza', 'Egypt'),
(3, '10 Freedom Road', '11765', 'Cairo', 'Egypt'),
(4, '88 Tahrir Square', '11522', 'Giza', 'Egypt'),
(5, '22 Palm Towers', '11330', 'Alexandria', 'Egypt'),
(6, '9 Lotus Compound', '11444', 'Cairo', 'Egypt'),
(7, '55 Horizon City', '11566', 'Cairo', 'Egypt'),
(8, '19 Corniche Rd', '21111', 'Alexandria', 'Egypt'),
(9, '77 Mountain View', '11355', 'Cairo', 'Egypt'),
(10,'5 Green Park', '11499', 'Cairo', 'Egypt'),
(11,'101 Lake View', '11821', 'Giza', 'Egypt'),
(12,'4 Sunset Valley', '11402', 'Cairo', 'Egypt'),
(13,'16 West Hills', '11378', 'Alexandria', 'Egypt'),
(14,'88 Sunrise District', '11588', 'Cairo', 'Egypt'),
(15,'33 Blue River', '11900', 'Cairo', 'Egypt'),
(16,'120 Island Road', '11392', 'Giza', 'Egypt'),
(17,'6 Marina Bay', '21122', 'Alexandria', 'Egypt'),
(18,'44 Ocean Drive', '11470', 'Cairo', 'Egypt'),
(19,'7 Maple Town', '11360', 'Giza', 'Egypt'),
(20,'11 Silver Heights', '11380', 'Cairo', 'Egypt');

DELIMITER $$

CREATE TRIGGER trg_payment_before_insert
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
    -- If payment is Cash, clear all card fields
    IF NEW.PaymentMethod = 'Cash' THEN
        SET NEW.CardholderName = NULL;
        SET NEW.CardNumber = NULL;
        SET NEW.ExpirationDate = NULL;
        SET NEW.CVC = NULL;
    ELSE
        -- For Credit/Debit, ensure card details are provided
        IF NEW.CardholderName IS NULL
           OR NEW.CardNumber IS NULL
           OR NEW.ExpirationDate IS NULL
           OR NEW.CVC IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Card details are required for non-cash payment methods';
        END IF;
    END IF;
END$$

DELIMITER ;
INSERT INTO Payment (UserID, PaymentMethod, CardholderName, CardNumber, ExpirationDate, CVC)
VALUES
(1, 'Cash', NULL, NULL, NULL, NULL),
(2, 'Cash', NULL, NULL, NULL, NULL),
(3, 'Cash', NULL, NULL, NULL, NULL),
(4, 'Cash', NULL, NULL, NULL, NULL),
(5, 'Cash', NULL, NULL, NULL, NULL),
(6, 'Cash', NULL, NULL, NULL, NULL),
(7, 'Cash', NULL, NULL, NULL, NULL),
(8, 'Cash', NULL, NULL, NULL, NULL),
(9, 'Cash', NULL, NULL, NULL, NULL),
(10, 'Cash', NULL, NULL, NULL, NULL),

(11, 'Credit', 'John Smith', '4111111111111111', '2027-08-01', '123'),
(12, 'Debit', 'David Jackson', '5500000000000004', '2026-11-01', '456'),
(13, 'Credit', 'Emily Clark', '4007000000027', '2028-02-01', '789'),
(14, 'Credit', 'Jennifer Brown', '6011000990139424', '2026-06-01', '321'),
(15, 'Debit', 'Youssef Fathy', '3530111333300000', '2027-09-01', '654'),
(16, 'Credit', 'Mariam Gamal', '4000056655665556', '2029-03-01', '987'),
(17, 'Debit', 'Alaa Ismail', '5105105105105100', '2026-12-01', '147'),
(18, 'Credit', 'Habiba Adel', '4111111111111129', '2028-07-01', '258'),
(19, 'Debit', 'Tarek Mostafa', '6011111111111117', '2027-01-01', '369'),
(20, 'Credit', 'Jana Samir', '3566002020360505', '2029-10-01', '159');

--FoodCategory
INSERT INTO FoodCategory (CategoryName, ImageURL)
VALUES
('Burger', 'frontend/resources/pngtree-burger-and-fries-ai-generated-png-image_14563042.png'),
('Pizza', 'frontend/resources/Pepperoni-pizza-on-a-white-background-top-view-for-menu-royalty-free-stock-photo-removebg-preview.png'),
('Meat Grill', 'frontend/resources/photo_2025-12-02_16-43-35.jpg'),
('Fried Chicken', 'frontend/resources/fried chicken category.jpg'),
('Dessert', 'frontend/resources/Elemento-3-D-Bolo-no-Prato-PNG-Transparente-removebg-preview.png'),
('Sushi','frontend/resources/download-49-removebg-preview.png');

--Restaurant
INSERT INTO Restaurant (RestaurantName, Address, imageURL)
VALUES
('Holmes', '12 Garden Street, Cairo', 'frontend/resources/Screenshot%202025-12-02%20170053.png?raw=true'),
('Pizza Hut', '45 Nile Avenue, Giza', 'frontend/resources/pizza.jpg'),
("Little E's", '10 Freedom Road, Cairo', 'frontend/resources/little.jpg'),
('5 Roosters', '19 Lotus Compound, Cairo', 'frontend/resources/5%20roosters.jpg'),
('Coff', '9 Lotus Compound, Cairo', 'frontend/resources/coff.jpg?raw=true'),
('The Wok Restaurant', '88 Tahrir Square, Giza', 'https://ibb.co/mrTqphqq');
--FoodItems
INSERT INTO FoodItems (CategoryID, RestaurantID, ItemName, ItemDescription, Price, imageURL)
VALUES
(1, 1, 'Classic Beef Burger', 'Beef patty, cheese, lettuce, tomato', 85.00, 'frontend/resources/Batatas-Fritas-E-Hamb-rguer-PNG-Comida-Comida-R-pida-Comida-N-o-Saud-vel-PNG-Imagem-para-download-gr.jpg'),
(2, 2, 'Pepperoni Pizza', 'Tomato, mozzarella, basil', 120.00, 'frontend/resources/Pepperoni-pizza-on-a-white-background-top-view-for-menu-royalty-free-stock-photo-removebg-preview.png'),
(3, 3, 'Mixed Grill Platter', 'Lamb chops, chicken, kofta', 180.00, 'frontend/resources/mix grill.jpg'),
(4, 4, 'fried Chicken (6 pcs)', 'Buttermilk marinated & fried', 95.00, 'frontend/resources/fried-chicken-food-png-image-11667430104zzejscquxz.png'),
(5, 5, 'Chocolate Lava Cake', 'Warm cake with molten center', 60.00, 'frontend/resources/22g242_1200x1200.webp'),
(6, 6, 'Salmon Roll (8 pcs)', 'Salmon, rice, nori', 140.00, 'frontend/resources/Screenshot-2025-11-21-191851-removebg-preview.png');

--Orders
INSERT INTO Orders (UserID, OrderDate, TotalAccount, DeliveryFee, ShippingAddressID, PaymentID)
VALUES
(1, '2025-02-01 14:30:00', 220.00, 15.00, 1, 1),
(2, '2025-02-02 18:20:00', 140.00, 20.00, 2, 2),
(3, '2025-03-05 12:10:00', 290.00, 15.00, 3, 3),
(4, '2025-03-07 20:45:00', 110.00, 15.00, 4, 4),
(5, '2025-04-10 13:25:00', 210.00, 10.00, 5, 5),
(6, '2025-04-12 19:00:00', 160.00, 20.00, 6, 6),
(7, '2025-05-01 17:30:00', 245.00, 15.00, 7, 7),
(8, '2025-05-03 08:15:00', 80.00, 10.00, 8, 8),
(9, '2025-06-21 12:50:00', 125.00, 10.00, 9, 9),
(10, '2025-06-25 21:05:00', 90.00, 15.00, 10, 10),
(11, '2025-07-04 14:00:00', 135.00, 15.00, 11, 11),
(12, '2025-07-10 15:30:00', 65.00, 10.00, 12, 12),
(13, '2025-08-01 13:10:00', 105.00, 10.00, 13, 13),
(14, '2025-08-12 19:40:00', 57.00, 12.00, 14, 14),
(15, '2025-09-18 18:20:00', 210.00, 15.00, 15, 15),
(16, '2025-09-20 11:05:00', 100.00, 15.00, 16, 16),
(17, '2025-10-02 09:30:00', 75.00, 10.00, 17, 17),
(18, '2025-10-05 10:40:00', 40.00, 10.00, 18, 18),
(19, '2025-11-03 20:10:00', 167.00, 12.00, 19, 19),
(20, '2025-11-15 16:00:00', 105.00, 15.00, 20, 20);
--OrderItems
INSERT INTO OrderItems (OrderID, ItemID, Quantity, Price)
VALUES
-- Order 1 (items 1 + 2)
(1, 1, 1, 85.00),
(1, 2, 1, 120.00),

-- Order 2 (item 2)
(2, 2, 1, 120.00),

-- Order 3 (items 3 + 4)
(3, 3, 1, 180.00),
(3, 4, 1, 95.00),

-- Order 4 (item 4)
(4, 4, 1, 95.00),

-- Order 5 (items 5 + 6)
(5, 5, 1, 60.00),
(5, 6, 1, 140.00),

-- Order 6 (item 6)
(6, 6, 1, 140.00);
--Reviews
INSERT INTO Reviews (UserID, ItemID, Rating, Review)
VALUES
(1, 1, 5, 'Excellent burger — juicy and well seasoned.'),
(2, 2, 4, 'Nice pizza, crust could be crispier.'),
(3, 3, 5, 'Great mixed grill platter, very flavorful.'),
(4, 4, 4, 'Chicken was crispy but a little salty.'),
(5, 5, 5, 'Lava cake was gooey and perfect.'),
(6, 6, 5, 'Fresh salmon rolls, well balanced.');
--Cart
INSERT INTO Cart (UserID, Cart_date)
VALUES
(1, '2025-11-25'),
(2, '2025-11-25'),
(3, '2025-11-25'),
(4, '2025-11-26'),
(5, '2025-11-26'),
(6, '2025-11-26'),
(7, '2025-11-27'),
(8, '2025-11-27'),
(9, '2025-11-27'),
(10,'2025-11-28'),
(11,'2025-11-28'),
(12,'2025-11-28'),
(13,'2025-11-29'),
(14,'2025-11-29'),
(15,'2025-11-29'),
(16,'2025-11-30'),
(17,'2025-11-30'),
(18,'2025-11-30'),
(19,'2025-11-30'),
(20,'2025-11-30');
--CartItems
INSERT INTO CartItems (CartID, ItemID, Price, Quantity, Size)
VALUES
(1, 1, 85.00, 1, 'Regular'),
(2, 2, 120.50, 1, 'Large'),
(3, 3, 180.00, 1, 'Family'),
(4, 4, 95.00, 2, 'Regular'),
(5, 5, 60.00, 1, 'Single'),
(6, 6, 140.00, 1, '8 pcs');
