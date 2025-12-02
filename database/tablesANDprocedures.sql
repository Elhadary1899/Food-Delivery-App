-- Create database and use it
CREATE DATABASE IF NOT EXISTS foodproject1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE foodproject1;

-- =================================================
-- TABLES
-- =================================================

CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    marketing_opt BOOLEAN DEFAULT TRUE,
    role VARCHAR(10) DEFAULT 'User',
    CHECK (email LIKE '%@google.com'),
    CHECK(role IN ('User','Admin'))
);

CREATE TABLE IF NOT EXISTS ShippingAddress (
    ShippingAddressID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    Address VARCHAR(200),
    PostalCode VARCHAR(20),
    City VARCHAR(100),
    Country VARCHAR(100),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Payment (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    PaymentMethod VARCHAR(50) NOT NULL,  -- Cash, Debit or Credit
    CardholderName VARCHAR(100),
    CardNumber VARCHAR(30),
    ExpirationDate VARCHAR(10),
    CVC VARCHAR(10),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS FoodCategory (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL,
    ImageURL VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Restaurant (
    RestaurantID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    Address VARCHAR(200),
    imageURL VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS FoodItems (
    ItemID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryID INT NOT NULL,
    RestaurantID INT NOT NULL,
    ItemName VARCHAR(150) NOT NULL,
    ItemDescription VARCHAR(255),
    Price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (RestaurantID) REFERENCES Restaurant(RestaurantID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    OrderDate DATETIME NOT NULL,
    TotalAccount DECIMAL(10,2) NOT NULL,
    DeliveryFee DECIMAL(10,2) NOT NULL,
    ShippingAddressID INT NOT NULL,
    PaymentID INT NOT NULL

);

CREATE TABLE IF NOT EXISTS OrderItems (
    OrderItemID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT NOT NULL,
    ItemID INT NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS Reviews (
    ReviewID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    ItemID INT NOT NULL,
    Rating INT,
    Review VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ItemID) REFERENCES FoodItems(ItemID) ON DELETE CASCADE,
    CHECK (Rating BETWEEN 1 AND 5)
);

CREATE TABLE IF NOT EXISTS Cart (
    CartID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL, 
    Cart_date DATE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS CartItems (
    CartItemID INT AUTO_INCREMENT PRIMARY KEY,
    CartID INT NOT NULL,
    ItemID INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Quantity INT NOT NULL,
    Size VARCHAR(50),
    FOREIGN KEY (CartID) REFERENCES Cart(CartID) ON DELETE CASCADE
  
);

-- =================================================
-- STORED PROCEDURES (DELIMITED)
-- =================================================
DELIMITER $$

-- ============================================
-- 1. Register New User
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_RegisterUser(
    IN p_username VARCHAR(100),
    IN p_email VARCHAR(150),
    IN p_password VARCHAR(200),
    IN p_marketing_opt BOOLEAN,
    IN p_role VARCHAR(10)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: Registration failed' AS message, 0 AS user_id;
    END;

    START TRANSACTION;

    INSERT INTO Users (username, email, password, marketing_opt, role)
    VALUES (p_username, p_email, p_password, p_marketing_opt, p_role);

    SELECT LAST_INSERT_ID() AS user_id, 'User registered successfully' AS message;

    COMMIT;
END$$



-- ============================================
-- 2-4. Authentication (by email, by id, by username)
-- ============================================

-- USER 

DELIMITER $$

CREATE PROCEDURE sp_UserSignIn(
    IN p_email VARCHAR(150),
    IN p_password VARCHAR(200)
)
BEGIN
    SELECT UserID, username, email, role
    FROM Users
    WHERE email = p_email
      AND password = p_password
      AND role = 'User';
END$$

CREATE PROCEDURE sp_AdminSignIn(
    IN p_email VARCHAR(150),
    IN p_password VARCHAR(200)
)
BEGIN
    SELECT UserID, username, email, role
    FROM Users
    WHERE email = p_email
      AND password = p_password
      AND role = 'Admin';
END$$



CREATE PROCEDURE sp_UserSignInById(
    IN p_user_id INT,
    IN p_password VARCHAR(200)
)
BEGIN
    SELECT UserID, username, email, role
    FROM Users
    WHERE UserID = p_user_id
      AND password = p_password
      AND role = 'User';
END$$

-- Admin 


CREATE PROCEDURE sp_AdminSignInById(
    IN p_user_id INT,
    IN p_password VARCHAR(200)
)
BEGIN
    SELECT UserID, username, email, role
    FROM Users
    WHERE UserID = p_user_id
      AND password = p_password
      AND role = 'Admin';
END$$
DELIMITER ;

-- ============================================
-- 5. Get User By ID
-- ============================================
DELIMITER $$
CREATE PROCEDURE sp_GetUserById(
    IN p_user_id INT
)
BEGIN
    SELECT UserID, username, email, marketing_opt, role
    FROM Users
    WHERE UserID = p_user_id;
END$$

-- ============================================
-- 6. Update User Profile
-- ============================================
CREATE PROCEDURE sp_UpdateUserProfile(
    IN p_user_id INT,
    IN p_username VARCHAR(100),
    IN p_email VARCHAR(150),
    IN p_marketing_opt BOOLEAN,
    IN p_role VARCHAR(10)
)
BEGIN
    UPDATE Users
    SET username = p_username,
        email = p_email,
        marketing_opt = p_marketing_opt,
        role = COALESCE(p_role, role)
    WHERE UserID = p_user_id;

    SELECT 'Profile updated successfully' AS message;
END$$

-- ============================================
-- 7. Add Shipping Address
-- ============================================
CREATE PROCEDURE sp_AddShippingAddress(
    IN p_user_id INT,
    IN p_address VARCHAR(200),
    IN p_postal_code VARCHAR(20),
    IN p_city VARCHAR(100),
    IN p_country VARCHAR(100)
)
BEGIN
    INSERT INTO ShippingAddress (UserID, Address, PostalCode, City, Country)
    VALUES (p_user_id, p_address, p_postal_code, p_city, p_country);

    SELECT LAST_INSERT_ID() AS shipping_address_id, 'Address added successfully' AS message;
END$$

-- ============================================
-- 8. Get User Shipping Addresses
-- ============================================
CREATE PROCEDURE sp_GetUserShippingAddresses(
    IN p_user_id INT
)
BEGIN
    SELECT ShippingAddressID, Address, PostalCode, City, Country
    FROM ShippingAddress
    WHERE UserID = p_user_id;
END$$

-- ============================================
-- 9. Update Shipping Address
-- ============================================
CREATE PROCEDURE sp_UpdateShippingAddress(
    IN p_shipping_address_id INT,
    IN p_address VARCHAR(200),
    IN p_postal_code VARCHAR(20),
    IN p_city VARCHAR(100),
    IN p_country VARCHAR(100)
)
BEGIN
    UPDATE ShippingAddress
    SET Address = p_address,
        PostalCode = p_postal_code,
        City = p_city,
        Country = p_country
    WHERE ShippingAddressID = p_shipping_address_id;

    SELECT 'Address updated successfully' AS message;
END$$

-- ============================================
-- 10. Delete Shipping Address
-- ============================================
CREATE PROCEDURE sp_DeleteShippingAddress(
    IN p_shipping_address_id INT
)
BEGIN
    DELETE FROM ShippingAddress WHERE ShippingAddressID = p_shipping_address_id;
    SELECT 'Address deleted successfully' AS message;
END$$

-- ============================================
-- 11. Add Payment Method
-- ============================================
CREATE PROCEDURE sp_AddPaymentMethod(
    IN p_user_id INT,
    IN p_payment_method VARCHAR(50),
    IN p_cardholder_name VARCHAR(100),
    IN p_card_number VARCHAR(30),
    IN p_expiration_date VARCHAR(10),
    IN p_cvc VARCHAR(10)
)
BEGIN
    INSERT INTO Payment (UserID, PaymentMethod, CardholderName, CardNumber, ExpirationDate, CVC)
    VALUES (p_user_id, p_payment_method, p_cardholder_name, p_card_number, p_expiration_date, p_cvc);

    SELECT LAST_INSERT_ID() AS payment_id, 'Payment method added successfully' AS message;
END$$

-- ============================================
-- 12. Get User Payment Methods
-- ============================================
CREATE PROCEDURE sp_GetUserPaymentMethods(
    IN p_user_id INT
)
BEGIN
    SELECT PaymentID, PaymentMethod, CardholderName,
           CONCAT('****', RIGHT(CardNumber, 4)) AS masked_card_number,
           ExpirationDate
    FROM Payment
    WHERE UserID = p_user_id;
END$$

-- ============================================
-- 13. Update Payment Method
-- ============================================
CREATE PROCEDURE sp_UpdatePaymentMethod(
    IN p_payment_id INT,
    IN p_payment_method VARCHAR(50),
    IN p_cardholder_name VARCHAR(100),
    IN p_card_number VARCHAR(30),
    IN p_expiration_date VARCHAR(10),
    IN p_cvc VARCHAR(10)
)
BEGIN
    UPDATE Payment
    SET PaymentMethod = p_payment_method,
        CardholderName = p_cardholder_name,
        CardNumber = p_card_number,
        ExpirationDate = p_expiration_date,
        CVC = p_cvc
    WHERE PaymentID = p_payment_id;

    SELECT 'Payment method updated successfully' AS message;
END$$

-- ============================================
-- MENU MANAGEMENT PROCEDURES
-- ============================================


CREATE PROCEDURE sp_GetAllCategories()
BEGIN
    SELECT CategoryID, CategoryName, ImageURL
    FROM FoodCategory
    ORDER BY CategoryName;
END$$


CREATE PROCEDURE sp_GetFoodItemsByCategory(
    IN p_category_name VARCHAR(100)
)
BEGIN
    SELECT 
        f.ItemID,
        f.ItemName,
        f.ItemDescription,
        f.Price,
        f.CategoryID,
        c.CategoryName,
        c.ImageURL,
        f.RestaurantID,
        COALESCE(AVG(r.Rating), 0) AS avg_rating,
        COUNT(r.ReviewID) AS review_count
    FROM FoodItems f
    LEFT JOIN FoodCategory c ON f.CategoryID = c.CategoryID
    LEFT JOIN Reviews r ON f.ItemID = r.ItemID
    WHERE c.CategoryName = p_category_name   
    GROUP BY f.ItemID
    ORDER BY f.ItemName;
END$$



CREATE PROCEDURE sp_GetAllFoodItems()
BEGIN
    SELECT f.ItemID, f.ItemName, f.ItemDescription, f.Price,
           f.CategoryID, c.CategoryName, c.ImageURL, f.RestaurantID,
           COALESCE(AVG(r.Rating), 0) AS avg_rating,
           COUNT(r.ReviewID) AS review_count
    FROM FoodItems f
    LEFT JOIN FoodCategory c ON f.CategoryID = c.CategoryID
    LEFT JOIN Reviews r ON f.ItemID = r.ItemID
    GROUP BY f.ItemID
    ORDER BY c.CategoryName, f.ItemName;
END$$

CREATE PROCEDURE sp_GetFoodItemById(
    IN p_item_id INT
)
BEGIN
    SELECT f.ItemID, f.ItemName, f.ItemDescription, f.Price,
           f.CategoryID, c.CategoryName, c.ImageURL, f.RestaurantID,
           COALESCE(AVG(r.Rating), 0) AS avg_rating,
           COUNT(r.ReviewID) AS review_count
    FROM FoodItems f
    LEFT JOIN FoodCategory c ON f.CategoryID = c.CategoryID
    LEFT JOIN Reviews r ON f.ItemID = r.ItemID
    WHERE f.ItemID = p_item_id
    GROUP BY f.ItemID;

    SELECT r.ReviewID, r.UserID, u.username, r.Rating, r.Review
    FROM Reviews r
    JOIN Users u ON r.UserID = u.UserID
    WHERE r.ItemID = p_item_id
    ORDER BY r.ReviewID DESC;
END$$

CREATE PROCEDURE sp_SearchFoodByName(
    IN p_search VARCHAR(100)
)
BEGIN
    SELECT 
        f.ItemID,
        f.ItemName,
        f.ItemDescription,
        f.Price,
        c.CategoryName,
        f.RestaurantID
    FROM FoodItems f
    LEFT JOIN FoodCategory c ON f.CategoryID = c.CategoryID
    WHERE f.ItemName LIKE CONCAT('%', p_search, '%');  -- 🔥 Search by item name
END$$



-- ============================================
-- Add / Update / Delete Food Item (Admin)
-- ============================================
CREATE PROCEDURE sp_AddFoodItem(
    IN p_category_id INT,
    IN p_restaurant_id INT,
    IN p_item_name VARCHAR(150),
    IN p_item_description VARCHAR(255),
    IN p_price DECIMAL(10,2)
)
BEGIN
    INSERT INTO FoodItems (CategoryID, RestaurantID, ItemName, ItemDescription, Price)
    VALUES (p_category_id, p_restaurant_id, p_item_name, p_item_description, p_price);

    SELECT LAST_INSERT_ID() AS item_id, 'Food item added successfully' AS message;
END$$

CREATE PROCEDURE sp_UpdateFoodItem(
    IN p_item_id INT,
    IN p_category_id INT,
    IN p_restaurant_id INT,
    IN p_item_name VARCHAR(150),
    IN p_item_description VARCHAR(255),
    IN p_price DECIMAL(10,2)
)
BEGIN
    UPDATE FoodItems
    SET CategoryID = p_category_id,
        RestaurantID = p_restaurant_id,
        ItemName = p_item_name,
        ItemDescription = p_item_description,
        Price = p_price
    WHERE ItemID = p_item_id;

    SELECT 'Food item updated successfully' AS message;
END$$

CREATE PROCEDURE sp_DeleteFoodItem(
    IN p_item_id INT
)
BEGIN
    DELETE FROM FoodItems WHERE ItemID = p_item_id;
    SELECT 'Food item deleted successfully' AS message;
END$$

-- ============================================
-- SHOPPING CART PROCEDURES
-- ============================================
CREATE PROCEDURE sp_GetOrCreateCart(
    IN p_user_id INT,
    OUT p_cart_id INT
)
BEGIN
    SELECT CartID INTO p_cart_id
    FROM Cart
    WHERE UserID = p_user_id
    ORDER BY Cart_date DESC
    LIMIT 1;

    IF p_cart_id IS NULL THEN
        INSERT INTO Cart (UserID, Cart_date)
        VALUES (p_user_id, CURDATE());
        SET p_cart_id = LAST_INSERT_ID();
    END IF;

    SELECT p_cart_id AS cart_id;
END$$

CREATE PROCEDURE sp_AddToCart(
    IN p_user_id INT,
    IN p_item_id INT,
    IN p_quantity INT,
    IN p_size VARCHAR(50)
)
BEGIN
    DECLARE v_cart_id INT;
    DECLARE v_price DECIMAL(10,2);
    DECLARE v_cart_item_id INT;

    CALL sp_GetOrCreateCart(p_user_id, v_cart_id);

    SELECT Price INTO v_price FROM FoodItems WHERE ItemID = p_item_id LIMIT 1;

    SELECT CartItemID INTO v_cart_item_id
    FROM CartItems
    WHERE CartID = v_cart_id AND ItemID = p_item_id AND Size = p_size
    LIMIT 1;

    IF v_cart_item_id IS NOT NULL THEN
        UPDATE CartItems
        SET Quantity = Quantity + p_quantity
        WHERE CartItemID = v_cart_item_id;
        SELECT 'Item quantity updated in cart' AS message;
    ELSE
        INSERT INTO CartItems (CartID, ItemID, Price, Quantity, Size)
        VALUES (v_cart_id, p_item_id, v_price, p_quantity, p_size);
        SELECT 'Item added to cart' AS message;
    END IF;
END$$

CREATE PROCEDURE sp_GetCartItems(
    IN p_user_id INT
)
BEGIN
    DECLARE v_cart_id INT;

    SELECT CartID INTO v_cart_id
    FROM Cart
    WHERE UserID = p_user_id
    ORDER BY Cart_date DESC
    LIMIT 1;

    IF v_cart_id IS NOT NULL THEN
        SELECT ci.CartItemID, ci.ItemID, f.ItemName, f.ItemDescription,
               ci.Quantity, ci.Price, ci.Size,
               (ci.Quantity * ci.Price) AS subtotal
        FROM CartItems ci
        JOIN FoodItems f ON ci.ItemID = f.ItemID
        WHERE ci.CartID = v_cart_id;

        SELECT COALESCE(SUM(Quantity * Price), 0) AS cart_total
        FROM CartItems
        WHERE CartID = v_cart_id;
    ELSE
        SELECT 'No active cart found' AS message;
    END IF;
END$$

CREATE PROCEDURE sp_UpdateCartQuantity(
    IN p_cart_item_id INT,
    IN p_quantity INT
)
BEGIN
    IF p_quantity > 0 THEN
        UPDATE CartItems
        SET Quantity = p_quantity
        WHERE CartItemID = p_cart_item_id;
        SELECT 'Cart quantity updated' AS message;
    ELSE
        DELETE FROM CartItems WHERE CartItemID = p_cart_item_id;
        SELECT 'Item removed from cart' AS message;
    END IF;
END$$

CREATE PROCEDURE sp_RemoveFromCart(
    IN p_cart_item_id INT
)
BEGIN
    DELETE FROM CartItems WHERE CartItemID = p_cart_item_id;
    SELECT 'Item removed from cart' AS message;
END$$

CREATE PROCEDURE sp_ClearCart(
    IN p_user_id INT
)
BEGIN
    DECLARE v_cart_id INT;

    SELECT CartID INTO v_cart_id
    FROM Cart
    WHERE UserID = p_user_id
    ORDER BY Cart_date DESC
    LIMIT 1;

    IF v_cart_id IS NOT NULL THEN
        DELETE FROM CartItems WHERE CartID = v_cart_id;
        SELECT 'Cart cleared successfully' AS message;
    END IF;
END$$

-- ============================================
-- CHECKOUT & ORDER PROCEDURES
-- ============================================
CREATE PROCEDURE sp_GetCheckoutSummary(
    IN p_user_id INT
)
BEGIN
    DECLARE v_cart_id INT;

    SELECT CartID INTO v_cart_id
    FROM Cart
    WHERE UserID = p_user_id
    ORDER BY Cart_date DESC
    LIMIT 1;

    IF v_cart_id IS NOT NULL THEN
        SELECT ci.CartItemID, ci.ItemID, f.ItemName,
               ci.Quantity, ci.Price, ci.Size,
               (ci.Quantity * ci.Price) AS subtotal
        FROM CartItems ci
        JOIN FoodItems f ON ci.ItemID = f.ItemID
        WHERE ci.CartID = v_cart_id;

        SELECT 
            COALESCE(SUM(Quantity * Price), 0) AS subtotal,
            5.00 AS delivery_fee,
            COALESCE(SUM(Quantity * Price), 0) + 5.00 AS total
        FROM CartItems
        WHERE CartID = v_cart_id;

        SELECT UserID, username, email
        FROM Users
        WHERE UserID = p_user_id;

        SELECT ShippingAddressID, Address, PostalCode, City, Country
        FROM ShippingAddress
        WHERE UserID = p_user_id;

        SELECT PaymentID, PaymentMethod, CardholderName,
               CONCAT('****', RIGHT(CardNumber, 4)) AS masked_card_number
        FROM Payment
        WHERE UserID = p_user_id;
    END IF;
END$$

-- ============================================
-- 29. Place Order (from cart)
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_PlaceOrder(
    IN p_user_id INT,
    IN p_shipping_address_id INT,
    IN p_payment_id INT,
    OUT p_order_id INT
)
BEGIN
    DECLARE v_cart_id INT;
    DECLARE v_total_amount DECIMAL(10,2);
    DECLARE v_delivery_fee DECIMAL(10,2) DEFAULT 5.00;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: Order placement failed' AS message, 0 AS order_id;
    END;

    START TRANSACTION;

    -- Get the latest cart for the user
    SELECT CartID INTO v_cart_id
    FROM Cart
    WHERE UserID = p_user_id
    ORDER BY Cart_date DESC
    LIMIT 1;

    -- Check if cart exists
    IF v_cart_id IS NULL THEN
        ROLLBACK;
        SELECT 'No cart found for user' AS message, 0 AS order_id;
    ELSE
        -- Calculate total amount
        SELECT COALESCE(SUM(Quantity * Price), 0) INTO v_total_amount
        FROM CartItems
        WHERE CartID = v_cart_id;

        -- Insert order
        INSERT INTO Orders (UserID, OrderDate, TotalAccount, DeliveryFee, ShippingAddressID, PaymentID)
        VALUES (p_user_id, NOW(), v_total_amount, v_delivery_fee, p_shipping_address_id, p_payment_id);

        SET p_order_id = LAST_INSERT_ID();

        -- Insert order items
        INSERT INTO OrderItems (OrderID, ItemID, Quantity, Price)
        SELECT p_order_id, ItemID, Quantity, Price
        FROM CartItems
        WHERE CartID = v_cart_id;

        -- Clear the cart
        DELETE FROM CartItems WHERE CartID = v_cart_id;

        COMMIT;

        SELECT p_order_id AS order_id, 'Order placed successfully' AS message;
    END IF;

END$$

DELIMITER ;

-- ============================================
-- Get Order / Order History
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_GetOrderById(
    IN p_order_id INT
)
BEGIN
    SELECT o.OrderID, o.UserID, u.username, u.email,
           o.OrderDate, o.TotalAccount, o.DeliveryFee,
           (o.TotalAccount + o.DeliveryFee) AS grand_total,
           sa.Address, sa.PostalCode, sa.City, sa.Country,
           pm.PaymentMethod, pm.CardholderName,
           CONCAT('****', RIGHT(pm.CardNumber, 4)) AS masked_card_number
    FROM Orders o
    LEFT JOIN Users u ON o.UserID = u.UserID
    LEFT JOIN ShippingAddress sa ON o.ShippingAddressID = sa.ShippingAddressID
    LEFT JOIN Payment pm ON o.PaymentID = pm.PaymentID
    WHERE o.OrderID = p_order_id;
    
    SELECT oi.OrderItemID, oi.ItemID, f.ItemName, f.ItemDescription,
           oi.Quantity, oi.Price, (oi.Quantity * oi.Price) AS subtotal
    FROM OrderItems oi
    JOIN FoodItems f ON oi.ItemID = f.ItemID
    WHERE oi.OrderID = p_order_id;
END$$

DELIMITER ;

DELIMITER $$
-- ============================================
-- REVIEW PROCEDURES
-- ============================================
CREATE PROCEDURE sp_AddReview(
    IN p_user_id INT,
    IN p_item_id INT,
    IN p_rating INT,
    IN p_review TEXT
)
BEGIN
    INSERT INTO Reviews (UserID, ItemID, Rating, Review)
    VALUES (p_user_id, p_item_id, p_rating, p_review);

    SELECT LAST_INSERT_ID() AS review_id, 'Review added successfully' AS message;
END$$

DELIMITER $$
CREATE PROCEDURE sp_GetItemReviews(
    IN p_item_id INT
)
BEGIN
    SELECT r.ReviewID, r.UserID, u.username, r.Rating, r.Review
    FROM Reviews r
    JOIN Users u ON r.UserID = u.UserID
    WHERE r.ItemID = p_item_id
    ORDER BY r.ReviewID DESC;
END$$

DELIMITER $$
CREATE PROCEDURE sp_GetAverageRating(
    IN p_item_id INT
)
BEGIN
    SELECT COALESCE(AVG(Rating), 0) AS avg_rating,
           COUNT(ReviewID) AS review_count
    FROM Reviews
    WHERE ItemID = p_item_id;
END$$

DELIMITER $$
CREATE PROCEDURE sp_UpdateReview(
    IN p_review_id INT,
    IN p_user_id INT,
    IN p_rating INT,
    IN p_review TEXT
)
BEGIN
    UPDATE Reviews
    SET Rating = p_rating,
        Review = p_review
    WHERE ReviewID = p_review_id AND UserID = p_user_id;

    SELECT 'Review updated successfully' AS message;
END$$

DELIMITER $$
CREATE PROCEDURE sp_DeleteReview(
    IN p_review_id INT,
    IN p_user_id INT
)
BEGIN
    DELETE FROM Reviews 
    WHERE ReviewID = p_review_id AND UserID = p_user_id;

    SELECT 'Review deleted successfully' AS message;
END$$

DELIMITER $$
CREATE PROCEDURE sp_GetUserReviews(
    IN p_user_id INT
)
BEGIN
    SELECT r.ReviewID, r.ItemID, f.ItemName, r.Rating, r.Review
    FROM Reviews r
    JOIN FoodItems f ON r.ItemID = f.ItemID
    WHERE r.UserID = p_user_id
    ORDER BY r.ReviewID DESC;
END$$

-- ============================================
-- ADMIN / REPORTS
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_GetDailySalesReport(
    IN p_date DATE
)
BEGIN
    SELECT DATE(OrderDate) AS report_date,
           COUNT(OrderID) AS total_orders,
           SUM(TotalAccount) AS total_revenue,
           SUM(DeliveryFee) AS total_delivery_fees,
           SUM(TotalAccount + DeliveryFee) AS grand_total,
           AVG(TotalAccount) AS avg_order_value
    FROM Orders
    WHERE DATE(OrderDate) = p_date;
END$$


DELIMITER $$

CREATE PROCEDURE sp_GetCustomerFeedbackSummary()
BEGIN
    SELECT 
        COUNT(ReviewID) AS total_reviews,
        AVG(Rating) AS avg_rating,
        SUM(CASE WHEN Rating = 5 THEN 1 ELSE 0 END) AS five_star,
        SUM(CASE WHEN Rating = 4 THEN 1 ELSE 0 END) AS four_star,
        SUM(CASE WHEN Rating = 3 THEN 1 ELSE 0 END) AS three_star,
        SUM(CASE WHEN Rating = 2 THEN 1 ELSE 0 END) AS two_star,
        SUM(CASE WHEN Rating = 1 THEN 1 ELSE 0 END) AS one_star
    FROM Reviews;
END$$

DELIMITER $$
CREATE PROCEDURE sp_SearchFoodItems(
    IN p_search_term VARCHAR(150)
)
BEGIN
    SELECT f.ItemID, f.ItemName, f.ItemDescription, f.Price,
           c.CategoryName,
           COALESCE(AVG(r.Rating), 0) AS avg_rating,
           COUNT(r.ReviewID) AS review_count
    FROM FoodItems f
    LEFT JOIN FoodCategory c ON f.CategoryID = c.CategoryID
    LEFT JOIN Reviews r ON f.ItemID = r.ItemID
    WHERE f.ItemName LIKE CONCAT('%', p_search_term, '%')
       OR f.ItemDescription LIKE CONCAT('%', p_search_term, '%')
    GROUP BY f.ItemID
    ORDER BY f.ItemName;
END$$

DELIMITER ;
