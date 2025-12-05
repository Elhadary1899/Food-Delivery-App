-- =================================================
-- STORED PROCEDURES
-- =================================================

-- ============================================
-- 1. Register New User
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_RegisterUser(
    IN p_username VARCHAR(100),
    IN p_email VARCHAR(150),
    IN p_password VARCHAR(200),
    IN p_phone VARCHAR(20),
    IN p_marketing_opt BOOLEAN,
    IN p_role VARCHAR(10)
)
proc_label: BEGIN
    DECLARE v_count_username INT DEFAULT 0;
    DECLARE v_count_email INT DEFAULT 0;
    DECLARE v_user_id INT DEFAULT NULL;
    DECLARE v_message VARCHAR(255);

    -- Validate phone
    IF p_phone IS NULL OR LENGTH(p_phone) = 0 THEN
        SET v_message = 'Error: Phone number is required';
        SELECT v_message AS message, NULL AS user_id, NULL AS username, NULL AS email, NULL AS role;
        LEAVE proc_label;
    END IF;

    -- Username duplicate
    SELECT COUNT(*) INTO v_count_username FROM Users WHERE username = p_username;

    IF v_count_username > 0 THEN
        SET v_message = 'Error: Username already exists';
        SELECT v_message AS message, NULL AS user_id, NULL AS username, NULL AS email, NULL AS role;
        LEAVE proc_label;
    END IF;

    -- Email duplicate
    SELECT COUNT(*) INTO v_count_email FROM Users WHERE email = p_email;

    IF v_count_email > 0 THEN
        SET v_message = 'Error: Email already exists';
        SELECT v_message AS message, NULL AS user_id, NULL AS username, NULL AS email, NULL AS role;
        LEAVE proc_label;
    END IF;

    -- Insert new user
    INSERT INTO Users (username, email, password, PhoneNumber, marketing_opt, role)
    VALUES (p_username, p_email, p_password, p_phone, p_marketing_opt, p_role);

    SET v_user_id = LAST_INSERT_ID();
    SET v_message = 'User registered successfully';

    -- ALWAYS return 1 final SELECT
    SELECT 
        v_message AS message,
        v_user_id AS user_id,
        p_username AS username,
        p_email AS email,
        p_role AS role;

END$$

DELIMITER ;

-- ============================================
-- 2. Authentication Procedures
-- ============================================
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

CREATE PROCEDURE sp_UserSignInByUsername(
    IN p_username VARCHAR(100),
    IN p_password VARCHAR(200)
)
BEGIN
    SELECT UserID, username, email, role
    FROM Users
    WHERE username = p_username
      AND password = p_password
      AND role = 'User';
END$$

CREATE PROCEDURE sp_AdminSignInByUsername(
    IN p_username VARCHAR(100),
    IN p_password VARCHAR(200)
)
BEGIN
    SELECT UserID, username, email, role
    FROM Users
    WHERE username = p_username
      AND password = p_password
      AND role = 'Admin';
END$$

DELIMITER ;

-- ============================================
-- 3. User Profile Management
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_GetUserByName(
    IN p_username VARCHAR(100)
)
BEGIN
    SELECT username, email, marketing_opt, role
    FROM Users
    WHERE username = p_username;
END$$

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

DELIMITER ;

-- ============================================
-- 4. Shipping Address Management
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_AddShippingAddress(
    IN p_user_id INT,
    IN p_address_name VARCHAR(100),
    IN p_address VARCHAR(200),
    IN p_postal_code VARCHAR(20),
    IN p_city VARCHAR(100),
    IN p_country VARCHAR(100)
)
BEGIN
    INSERT INTO ShippingAddress (UserID, AddressName, Address, PostalCode, City, Country)
    VALUES (p_user_id, p_address_name, p_address, p_postal_code, p_city, p_country);

    SELECT 'Address added successfully' AS message;
END$$

CREATE PROCEDURE sp_GetUserShippingAddresses(
    IN p_user_id INT
)
BEGIN
    SELECT ShippingAddressID, AddressName, Address, PostalCode, City, Country
    FROM ShippingAddress
    WHERE UserID = p_user_id;
END$$

CREATE PROCEDURE sp_UpdateShippingAddress(
    IN p_user_id INT,
    IN p_address VARCHAR(200),
    IN p_new_address VARCHAR(200),
    IN p_postal_code VARCHAR(20),
    IN p_city VARCHAR(100),
    IN p_country VARCHAR(100)
)
BEGIN
    UPDATE ShippingAddress
    SET Address = p_new_address,
        PostalCode = p_postal_code,
        City = p_city,
        Country = p_country
    WHERE UserID = p_user_id AND Address = p_address;

    SELECT 'Address updated successfully' AS message;
END$$

DELIMITER ;

-- ============================================
-- 5. Payment Method Management
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_AddPaymentMethod(
    IN p_user_id INT,
    IN p_payment_name VARCHAR(50),
    IN p_payment_method VARCHAR(50),
    IN p_cardholder_name VARCHAR(100),
    IN p_card_number VARCHAR(30),
    IN p_expiration_date VARCHAR(10),
    IN p_cvc VARCHAR(10)
)
BEGIN
    INSERT INTO Payment (UserID, PaymentName, PaymentMethod, CardholderName, CardNumber, ExpirationDate, CVC)
    VALUES (p_user_id, p_payment_name, p_payment_method, p_cardholder_name, p_card_number, p_expiration_date, p_cvc);

    SELECT 'Payment method added successfully' AS message;
END$$

CREATE PROCEDURE sp_GetUserPaymentMethods(
    IN p_user_id INT
)
BEGIN
    SELECT 
        PaymentID,
        PaymentName,
        PaymentMethod,
        CardholderName,
        CONCAT('****', RIGHT(CardNumber, 4)) AS masked_card_number,
        ExpirationDate
    FROM Payment
    WHERE UserID = p_user_id;
END$$

CREATE PROCEDURE sp_UpdatePaymentMethod(
    IN p_user_id INT,
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
    WHERE UserID = p_user_id AND CardNumber = p_card_number;

    SELECT 'Payment method updated successfully' AS message;
END$$

CREATE PROCEDURE sp_DeletePaymentMethod(
    IN p_user_id INT,
    IN p_card_number VARCHAR(30)
)
BEGIN
    DELETE FROM Payment 
    WHERE UserID = p_user_id AND CardNumber = p_card_number;

    SELECT 'Payment method deleted successfully' AS message;
END$$

DELIMITER ;

-- ============================================
-- 6. RESTAURANT & MENU PROCEDURES
-- ============================================
DELIMITER $$

-- Get all restaurants
CREATE PROCEDURE sp_GetAllRestaurants()
BEGIN
    SELECT 
        RestaurantID,
        RestaurantName,
        RestaurantRating,
        Address,
        imageURL
    FROM Restaurant
    ORDER BY RestaurantRating DESC;
END$$

-- Get categories by restaurant name
CREATE PROCEDURE sp_GetCategoriesByRestaurant(
    IN p_restaurant_name VARCHAR(255)
)
BEGIN
    SELECT DISTINCT
        fc.CategoryID,
        fc.CategoryName,
        fc.ImageURL
    FROM FoodItems f
    JOIN FoodCategory fc ON f.CategoryID = fc.CategoryID
    JOIN Restaurant r ON f.RestaurantID = r.RestaurantID
    WHERE r.RestaurantName = p_restaurant_name
    ORDER BY fc.CategoryName;
END$$

-- Get food items by restaurant
CREATE PROCEDURE sp_GetFoodItemsByRestaurant(
    IN p_restaurant_name VARCHAR(255)
)
BEGIN
    SELECT 
        f.ItemID,
        f.ItemName,
        f.ItemDescription,
        f.Price,
        f.ImageURL,
        c.CategoryName,
        r.RestaurantName,
        COALESCE(AVG(rv.Rating), 0) AS avg_rating,
        COUNT(rv.ReviewID) AS review_count
    FROM FoodItems f
    LEFT JOIN FoodCategory c ON f.CategoryID = c.CategoryID
    LEFT JOIN Restaurant r ON f.RestaurantID = r.RestaurantID
    LEFT JOIN Reviews rv ON f.ItemID = rv.ItemID
    WHERE r.RestaurantName = p_restaurant_name
    GROUP BY f.ItemID
    ORDER BY c.CategoryName, f.ItemName;
END$$

-- Get food items by category
CREATE PROCEDURE sp_GetFoodItemsByCategory(
    IN p_category_name VARCHAR(100)
)
BEGIN
    SELECT 
        f.ItemID,
        f.ItemName,
        f.ItemDescription,
        f.Price,
        f.ImageURL,
        c.CategoryName,
        r.RestaurantName,
        COALESCE(AVG(rv.Rating), 0) AS avg_rating,
        COUNT(rv.ReviewID) AS review_count
    FROM FoodItems f
    LEFT JOIN FoodCategory c ON f.CategoryID = c.CategoryID
    LEFT JOIN Restaurant r ON f.RestaurantID = r.RestaurantID
    LEFT JOIN Reviews rv ON f.ItemID = rv.ItemID
    WHERE c.CategoryName = p_category_name   
    GROUP BY f.ItemID
    ORDER BY f.ItemName;
END$$

-- Get food items by category AND restaurant
CREATE PROCEDURE sp_GetFoodItemsByCategoryAndRestaurant(
    IN p_category_name VARCHAR(100),
    IN p_restaurant_name VARCHAR(200)
)
BEGIN
    SELECT 
        f.ItemID,
        f.ItemName,
        f.ItemDescription,
        f.Price,
        f.ImageURL,
        c.CategoryName,
        r.RestaurantName,
        COALESCE(AVG(rv.Rating), 0) AS avg_rating,
        COUNT(rv.ReviewID) AS review_count
    FROM FoodItems f
    LEFT JOIN FoodCategory c ON f.CategoryID = c.CategoryID
    LEFT JOIN Restaurant r ON f.RestaurantID = r.RestaurantID
    LEFT JOIN Reviews rv ON f.ItemID = rv.ItemID
    WHERE c.CategoryName = p_category_name
      AND r.RestaurantName = p_restaurant_name
    GROUP BY f.ItemID
    ORDER BY f.ItemName;
END$$

-- Get details for a single item
CREATE PROCEDURE sp_GetItemDetails(
    IN p_item_name VARCHAR(150),
    IN p_restaurant_name VARCHAR(255)
)
BEGIN
    SELECT 
        f.ItemID,
        f.ItemName,
        f.ItemDescription,
        f.Price,
        f.ImageURL,
        c.CategoryName,
        r.RestaurantName,
        COALESCE(AVG(rv.Rating), 0) AS avg_rating,
        COUNT(rv.ReviewID) AS review_count
    FROM FoodItems f
    JOIN FoodCategory c ON f.CategoryID = c.CategoryID
    JOIN Restaurant r ON f.RestaurantID = r.RestaurantID
    LEFT JOIN Reviews rv ON f.ItemID = rv.ItemID
    WHERE f.ItemName = p_item_name
      AND r.RestaurantName = p_restaurant_name
    GROUP BY f.ItemID;
END$$

-- Recommended items
CREATE PROCEDURE sp_GetRecommendedItems(
    IN p_item_name VARCHAR(150),
    IN p_restaurant_name VARCHAR(255)
)
BEGIN
    SELECT 
        f.ItemID,
        f.ItemName,
        f.ItemDescription,
        f.Price,
        f.ImageURL,
        c.CategoryID,
        c.CategoryName,
        COALESCE(AVG(rv.Rating), 0) AS avg_rating,
        COUNT(rv.ReviewID) AS review_count
    FROM FoodItems f
    JOIN FoodCategory c ON f.CategoryID = c.CategoryID
    JOIN Restaurant r ON f.RestaurantID = r.RestaurantID
    LEFT JOIN Reviews rv ON f.ItemID = rv.ItemID
    WHERE r.RestaurantName = p_restaurant_name
      AND f.ItemName <> p_item_name
    GROUP BY f.ItemID
    ORDER BY avg_rating DESC, f.ItemName;
END$$

-- Search inside a restaurant
CREATE PROCEDURE sp_SearchFoodInRestaurant(
    IN p_restaurant_name VARCHAR(255),
    IN p_search VARCHAR(100)
)
BEGIN
    SELECT 
        f.ItemID,
        f.ItemName,
        f.ItemDescription,
        f.Price,
        f.ImageURL,
        c.CategoryName,
        r.RestaurantName,
        COALESCE(AVG(rv.Rating), 0) AS avg_rating,
        COUNT(rv.ReviewID) AS review_count
    FROM FoodItems f
    LEFT JOIN FoodCategory c ON f.CategoryID = c.CategoryID
    LEFT JOIN Restaurant r ON f.RestaurantID = r.RestaurantID
    LEFT JOIN Reviews rv ON f.ItemID = rv.ItemID
    WHERE r.RestaurantName = p_restaurant_name
      AND (f.ItemName LIKE CONCAT('%', p_search, '%')
        OR f.ItemDescription LIKE CONCAT('%', p_search, '%'))
    GROUP BY f.ItemID
    ORDER BY f.ItemName;
END$$

DELIMITER ;

-- ============================================
-- 7. ADMIN FOOD MANAGEMENT
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_AddFoodItem(
    IN p_category_name VARCHAR(100),
    IN p_restaurant_name VARCHAR(255),
    IN p_item_name VARCHAR(150),
    IN p_item_description VARCHAR(255),
    IN p_price DECIMAL(10,2),
    IN p_image_url VARCHAR(500)
)
BEGIN
    DECLARE v_category_id INT;
    DECLARE v_restaurant_id INT;

    SELECT CategoryID INTO v_category_id
    FROM FoodCategory
    WHERE CategoryName = p_category_name
    LIMIT 1;

    SELECT RestaurantID INTO v_restaurant_id
    FROM Restaurant
    WHERE RestaurantName = p_restaurant_name
    LIMIT 1;

    INSERT INTO FoodItems (CategoryID, RestaurantID, ItemName, ItemDescription, Price, ImageURL)
    VALUES (v_category_id, v_restaurant_id, p_item_name, p_item_description, p_price, p_image_url);

    SELECT 'Food item added successfully' AS message;
END$$


CREATE PROCEDURE sp_UpdateFoodItem(
    IN p_item_name VARCHAR(150),
    IN p_category_name VARCHAR(100),
    IN p_restaurant_name VARCHAR(255),
    IN p_new_item_name VARCHAR(150),
    IN p_item_description VARCHAR(255),
    IN p_price DECIMAL(10,2),
    IN p_image_url VARCHAR(500)
)
BEGIN
    DECLARE v_category_id INT;
    DECLARE v_restaurant_id INT;

    SELECT CategoryID INTO v_category_id
    FROM FoodCategory
    WHERE CategoryName = p_category_name
    LIMIT 1;

    SELECT RestaurantID INTO v_restaurant_id
    FROM Restaurant
    WHERE RestaurantName = p_restaurant_name
    LIMIT 1;

    UPDATE FoodItems
    SET CategoryID = v_category_id,
        RestaurantID = v_restaurant_id,
        ItemName = p_new_item_name,
        ItemDescription = p_item_description,
        Price = p_price,
        ImageURL = p_image_url
    WHERE ItemName = p_item_name;

    SELECT 'Food item updated successfully' AS message;
END$$


CREATE PROCEDURE sp_DeleteFoodItem(
    IN p_item_name VARCHAR(150)
)
BEGIN
    DELETE FROM FoodItems 
    WHERE ItemName = p_item_name;

    SELECT 'Food item deleted successfully' AS message;
END$$

DELIMITER ;

DELIMITER $$

-- ============================================
-- 8. SHOPPING CART PROCEDURES
-- ============================================
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

    -- Get or create a cart
    SELECT CartID INTO v_cart_id
    FROM Cart
    WHERE UserID = p_user_id
    ORDER BY Cart_date DESC
    LIMIT 1;

    IF v_cart_id IS NULL THEN
        INSERT INTO Cart (UserID, Cart_date)
        VALUES (p_user_id, CURDATE());
        SET v_cart_id = LAST_INSERT_ID();
    END IF;

    -- Get item price
    SELECT Price INTO v_price
    FROM FoodItems
    WHERE ItemID = p_item_id;

    -- Check if same item with same size already exists
    SELECT CartItemID INTO v_cart_item_id
    FROM CartItems
    WHERE CartID = v_cart_id 
      AND ItemID = p_item_id 
      AND Size = p_size
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
proc_label: BEGIN
    DECLARE v_cart_id INT;

    SELECT CartID INTO v_cart_id
    FROM Cart
    WHERE UserID = p_user_id
    ORDER BY Cart_date DESC
    LIMIT 1;

    IF v_cart_id IS NULL THEN
        SELECT 'No active cart found' AS message;
        LEAVE proc_label;
    END IF;

    -- 1) Items list
    SELECT 
        f.ItemID,
        f.ItemName,
        f.ImageURL,
        f.ItemDescription,
        ci.Quantity,
        ci.Price,
        ci.Size,
        (ci.Quantity * ci.Price) AS subtotal
    FROM CartItems ci
    JOIN FoodItems f ON f.ItemID = ci.ItemID
    WHERE ci.CartID = v_cart_id;

    -- 2) Total
    SELECT 
        COALESCE(SUM(Quantity * Price), 0) AS cart_total
    FROM CartItems
    WHERE CartID = v_cart_id;
END$$

CREATE PROCEDURE sp_UpdateCartQuantity(
    IN p_user_id INT,
    IN p_item_id INT,
    IN p_size VARCHAR(50),
    IN p_change INT
)
BEGIN
    DECLARE v_cart_id INT;
    DECLARE v_current_qty INT;
    DECLARE v_new_qty INT;

    SELECT CartID INTO v_cart_id
    FROM Cart
    WHERE UserID = p_user_id
    ORDER BY Cart_date DESC
    LIMIT 1;

    SELECT Quantity INTO v_current_qty
    FROM CartItems
    WHERE CartID = v_cart_id AND ItemID = p_item_id AND Size = p_size;

    SET v_new_qty = v_current_qty + p_change;

    IF v_new_qty <= 0 THEN
        DELETE FROM CartItems
        WHERE CartID = v_cart_id AND ItemID = p_item_id AND Size = p_size;

        SELECT 'Item removed from cart' AS message;
    ELSE
        UPDATE CartItems
        SET Quantity = v_new_qty
        WHERE CartID = v_cart_id AND ItemID = p_item_id AND Size = p_size;

        SELECT CONCAT('Quantity updated to ', v_new_qty) AS message;
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_RemoveFromCart(
    IN p_user_id INT,
    IN p_item_id INT,
    IN p_size VARCHAR(50)
)
BEGIN
    DECLARE v_cart_id INT;

    -- Get the latest active cart for the user
    SELECT CartID INTO v_cart_id
    FROM Cart
    WHERE UserID = p_user_id
    ORDER BY Cart_date DESC
    LIMIT 1;

    -- Remove the item
    DELETE FROM CartItems
    WHERE CartID = v_cart_id
      AND ItemID = p_item_id
      AND Size = p_size;

    SELECT 'Item removed successfully' AS message;
END$$

DELIMITER ;

-- ============================================
-- 9. CHECKOUT & ORDER PROCEDURES
-- ============================================

DELIMITER $$

CREATE PROCEDURE sp_GetCheckoutSummary(
    IN p_user_id INT
)
proc_label: BEGIN
    DECLARE v_cart_id INT;

    -- Latest cart
    SELECT CartID INTO v_cart_id
    FROM Cart
    WHERE UserID = p_user_id
    ORDER BY Cart_date DESC
    LIMIT 1;

    IF v_cart_id IS NULL THEN
        -- Return 5 empty result sets for frontend compatibilitySELECT 1 FROM DUAL WHERE 0;
        SELECT 1 FROM DUAL WHERE 0;
        SELECT 1 FROM DUAL WHERE 0;
        SELECT 1 FROM DUAL WHERE 0;
        SELECT 1 FROM DUAL WHERE 0;
        LEAVE proc_label;
    END IF;

    -- 1) Cart items
    SELECT 
        f.ItemID,
        f.ItemName,
        f.ImageURL,
        ci.Quantity,
        ci.Price,
        ci.Size,
        (ci.Quantity * ci.Price) AS subtotal
    FROM CartItems ci
    JOIN FoodItems f ON ci.ItemID = f.ItemID
    WHERE ci.CartID = v_cart_id;

    -- 2) Totals
    SELECT 
        COALESCE(SUM(ci.Quantity * ci.Price), 0) AS subtotal,
        5.00 AS delivery_fee,
        COALESCE(SUM(ci.Quantity * ci.Price), 0) + 5.00 AS total
    FROM CartItems ci
    WHERE ci.CartID = v_cart_id;

    -- 3) User info
    SELECT UserID, username, email
    FROM Users
    WHERE UserID = p_user_id;

    -- 4) Shipping addresses
    SELECT 
        ShippingAddressID AS address_id,
        AddressName,
        Address,
        PostalCode,
        City,
        Country
    FROM ShippingAddress
    WHERE UserID = p_user_id;

    -- 5) Payments
    SELECT 
        PaymentID AS payment_id,
        PaymentName,
        PaymentMethod AS method,
        CardholderName,
        CONCAT('****', RIGHT(CardNumber, 4)) AS masked_card_number
    FROM Payment
    WHERE UserID = p_user_id;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_PlaceOrder(
    IN p_user_id INT,
    IN p_address_id INT,
    IN p_payment_id INT,
    OUT p_order_number VARCHAR(50)
)
proc_label: BEGIN
    DECLARE v_cart_id INT;
    DECLARE v_order_id INT;
    DECLARE v_total_amount DECIMAL(10,2);
    DECLARE v_delivery_fee DECIMAL(10,2) DEFAULT 5.00;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        SET p_order_number = NULL;
    END;

    START TRANSACTION;

    SELECT CartID INTO v_cart_id
    FROM Cart
    WHERE UserID = p_user_id
    ORDER BY Cart_date DESC
    LIMIT 1;

    IF v_cart_id IS NULL THEN
        ROLLBACK;
        SET p_order_number = NULL;
        LEAVE proc_label;  
    END IF;

    SELECT COALESCE(SUM(Quantity * Price), 0)
    INTO v_total_amount
    FROM CartItems
    WHERE CartID = v_cart_id;

    INSERT INTO Orders (
        UserID, OrderDate, TotalAccount, DeliveryFee,
        ShippingAddressID, PaymentID, OrderStatus
    )
    VALUES (
        p_user_id, NOW(), v_total_amount, v_delivery_fee,
        p_address_id, p_payment_id, 'Placed'
    );

    SET v_order_id = LAST_INSERT_ID();
    SET p_order_number = CONCAT('ORD-', LPAD(v_order_id, 8, '0'));

    INSERT INTO OrderItems (OrderID, ItemID, Quantity, Price)
    SELECT v_order_id, ItemID, Quantity, Price
    FROM CartItems
    WHERE CartID = v_cart_id;

    INSERT INTO OrderStatusHistory (OrderID, Status)
    VALUES (v_order_id, 'Placed');

    DELETE FROM CartItems WHERE CartID = v_cart_id;

    COMMIT;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_GetOrderByNumber(
    IN p_order_number VARCHAR(50)
)
BEGIN
    DECLARE v_order_id INT;

    SET v_order_id = CAST(SUBSTRING(p_order_number, 5) AS UNSIGNED);

    -- Order details
    SELECT 
        CONCAT('ORD-', LPAD(o.OrderID, 8, '0')) AS order_number,
        o.UserID,
        u.username,
        u.email,
        o.OrderDate,
        o.TotalAccount,
        o.DeliveryFee,
        (o.TotalAccount + o.DeliveryFee) AS grand_total,
        sa.AddressName,
        sa.Address,
        sa.PostalCode,
        sa.City,
        sa.Country,
        pm.PaymentName,
        pm.PaymentMethod,
        CONCAT('****', RIGHT(pm.CardNumber, 4)) AS masked_card_number
    FROM Orders o
    LEFT JOIN Users u ON o.UserID = u.UserID
    LEFT JOIN ShippingAddress sa ON o.ShippingAddressID = sa.ShippingAddressID
    LEFT JOIN Payment pm ON o.PaymentID = pm.PaymentID
    WHERE o.OrderID = v_order_id;

    -- Order items
    SELECT 
        f.ItemID,
        f.ItemName,
        f.ItemDescription,
        f.ImageURL,
        oi.Quantity,
        oi.Price,
        (oi.Quantity * oi.Price) AS subtotal
    FROM OrderItems oi
    JOIN FoodItems f ON oi.ItemID = f.ItemID
    WHERE oi.OrderID = v_order_id;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_GetUserOrderHistory(
    IN p_user_id INT
)
BEGIN
    SELECT 
        CONCAT('ORD-', LPAD(o.OrderID, 8, '0')) AS order_number,
        o.OrderDate,
        o.TotalAccount,
        o.DeliveryFee,
        (o.TotalAccount + o.DeliveryFee) AS grand_total,
        COUNT(oi.OrderItemID) AS item_count
    FROM Orders o
    LEFT JOIN OrderItems oi ON o.OrderID = oi.OrderID
    WHERE o.UserID = p_user_id
    GROUP BY o.OrderID
    ORDER BY o.OrderDate DESC;
END$$

DELIMITER ;

-- ============================================
-- 10. REVIEW PROCEDURES
-- ============================================

DELIMITER $$

CREATE PROCEDURE sp_AddReview(
    IN p_user_id INT,
    IN p_item_name VARCHAR(150),
    IN p_restaurant_name VARCHAR(255),
    IN p_rating INT,
    IN p_review TEXT
)
BEGIN
    DECLARE v_item_id INT;

    IF p_rating < 1 OR p_rating > 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Rating must be between 1 and 5';
    END IF;

    SELECT f.ItemID INTO v_item_id
    FROM FoodItems f
    JOIN Restaurant r ON f.RestaurantID = r.RestaurantID
    WHERE f.ItemName = p_item_name
      AND r.RestaurantName = p_restaurant_name
    LIMIT 1;

    IF v_item_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid item or restaurant';
    END IF;

    INSERT INTO Reviews (UserID, ItemID, Rating, Review)
    VALUES (p_user_id, v_item_id, p_rating, p_review);

    SELECT 'Review added successfully' AS message;
END$$



CREATE PROCEDURE sp_GetItemReviewsByName(
    IN p_item_name VARCHAR(150),
    IN p_restaurant_name VARCHAR(255)
)
BEGIN
    SELECT 
        u.username,
        f.ItemName,
        r.RestaurantName,
        rv.Rating,
        rv.Review
    FROM Reviews rv
    JOIN FoodItems f ON rv.ItemID = f.ItemID
    JOIN Restaurant r ON f.RestaurantID = r.RestaurantID
    JOIN Users u ON rv.UserID = u.UserID
    WHERE f.ItemName = p_item_name
      AND r.RestaurantName = p_restaurant_name
    ORDER BY rv.ReviewID DESC;
END$$



CREATE PROCEDURE sp_GetAverageRatingByName(
    IN p_item_name VARCHAR(150),
    IN p_restaurant_name VARCHAR(255)
)
BEGIN
    SELECT 
        COALESCE(AVG(rv.Rating), 0) AS avg_rating,
        COUNT(rv.ReviewID) AS review_count
    FROM Reviews rv
    JOIN FoodItems f ON rv.ItemID = f.ItemID
    JOIN Restaurant r ON f.RestaurantID = r.RestaurantID
    WHERE f.ItemName = p_item_name
      AND r.RestaurantName = p_restaurant_name;
END$$



CREATE PROCEDURE sp_UpdateReviewByUserAndItem(
    IN p_user_id INT,
    IN p_item_name VARCHAR(150),
    IN p_restaurant_name VARCHAR(255),
    IN p_rating INT,
    IN p_review TEXT
)
BEGIN
    IF p_rating < 1 OR p_rating > 5 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Rating must be between 1 and 5';
    END IF;

    UPDATE Reviews rv
    JOIN FoodItems f ON rv.ItemID = f.ItemID
    JOIN Restaurant r ON f.RestaurantID = r.RestaurantID
    SET rv.Rating = p_rating,
        rv.Review = p_review
    WHERE rv.UserID = p_user_id
      AND f.ItemName = p_item_name
      AND r.RestaurantName = p_restaurant_name;

    SELECT 'Review updated successfully' AS message;
END$$



CREATE PROCEDURE sp_DeleteReviewByUserAndItem(
    IN p_user_id INT,
    IN p_item_name VARCHAR(150),
    IN p_restaurant_name VARCHAR(255)
)
BEGIN
    DELETE rv
    FROM Reviews rv
    JOIN FoodItems f ON rv.ItemID = f.ItemID
    JOIN Restaurant r ON f.RestaurantID = r.RestaurantID
    WHERE rv.UserID = p_user_id
      AND f.ItemName = p_item_name
      AND r.RestaurantName = p_restaurant_name;

    SELECT 'Review deleted successfully' AS message;
END$$



CREATE PROCEDURE sp_GetUserReviewsWithDetails(
    IN p_user_id INT
)
BEGIN
    SELECT 
        f.ItemName,
        f.ImageURL AS ItemImageURL,
        rv.Rating,
        rv.Review,
        r.RestaurantName
    FROM Reviews rv
    JOIN FoodItems f ON rv.ItemID = f.ItemID
    JOIN Restaurant r ON f.RestaurantID = r.RestaurantID
    WHERE rv.UserID = p_user_id
    ORDER BY rv.ReviewID DESC;
END$$

DELIMITER ;

-- ============================================
-- 11. ADMIN REPORTS
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_GetDailySalesReport(
    IN p_date DATE
)
BEGIN
    SELECT 
        DATE(OrderDate) AS report_date,
        COUNT(OrderID) AS total_orders,
        SUM(TotalAccount) AS total_revenue,
        SUM(DeliveryFee) AS total_delivery_fees,
        SUM(TotalAccount + DeliveryFee) AS grand_total,
        AVG(TotalAccount) AS avg_order_value
    FROM Orders
    WHERE DATE(OrderDate) = p_date;
END$$



CREATE PROCEDURE sp_GetCustomerFeedbackSummary()
BEGIN
    SELECT 
        COUNT(ReviewID) AS total_reviews,
        AVG(Rating) AS avg_rating,
        SUM(Rating = 5) AS five_star,
        SUM(Rating = 4) AS four_star,
        SUM(Rating = 3) AS three_star,
        SUM(Rating = 2) AS two_star,
        SUM(Rating = 1) AS one_star
    FROM Reviews;
END$$

DELIMITER ;

