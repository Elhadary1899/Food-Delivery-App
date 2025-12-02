-- =================================================
-- STORED PROCEDURES (NAME-BASED, NO IDs EXPOSED)
-- =================================================

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
    DECLARE v_count_username INT;
    DECLARE v_count_email INT;

    START TRANSACTION;

    -- Check if username already exists
    SELECT COUNT(*) INTO v_count_username
    FROM Users
    WHERE username = p_username;

    IF v_count_username > 0 THEN
        ROLLBACK;
        SELECT 'Error: Username already exists' AS message, 0 AS user_id;

    ELSE
        -- Check if email already exists
        SELECT COUNT(*) INTO v_count_email
        FROM Users
        WHERE email = p_email;

        IF v_count_email > 0 THEN
            ROLLBACK;
            SELECT 'Error: Email already exists' AS message, 0 AS user_id;

        ELSE
            -- Insert new user
            INSERT INTO Users (username, email, password, marketing_opt, role)
            VALUES (p_username, p_email, p_password, p_marketing_opt, p_role);

            SELECT LAST_INSERT_ID() AS user_id, 'User registered successfully' AS message;

            COMMIT;
        END IF;
    END IF;
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
END$

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
END$

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
-- 4. Shipping Address Management (Name-Based)
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
    SELECT AddressName, Address, PostalCode, City, Country
    FROM ShippingAddress
    WHERE UserID = p_user_id;
END$$

CREATE PROCEDURE sp_UpdateShippingAddress(
    IN p_user_id INT,
    IN p_address VARCHAR(100),
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
-- 5. Payment Method Management (Name-Based)
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_AddPaymentMethod(
    IN p_user_id INT,
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
    SELECT PaymentName, PaymentMethod, CardholderName,
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
    WHERE UserID = p_user_id AND  CardNumber = p_card_number;

    SELECT 'Payment method updated successfully' AS message;
END$$

CREATE PROCEDURE sp_DeletePaymentMethod(
    IN p_user_id INT,
    IN p_CardNumber VARCHAR(100)
)
BEGIN
    DELETE FROM Payment 
    WHERE UserID = p_user_id AND CardNumber = p_CardNumber;
    
    SELECT 'Payment method deleted successfully' AS message;
END$$

DELIMITER ;

-- ============================================
-- 6. RESTAURANT & MENU PROCEDURES
-- ============================================
DELIMITER $$

-- Get all restaurants with images
CREATE PROCEDURE sp_GetAllRestaurants()
BEGIN
    SELECT 
        RestaurantName,
        ImageURL,
        Description
    FROM Restaurant
    ORDER BY RestaurantName;
END$$

-- Get categories by restaurant name
CREATE PROCEDURE sp_GetCategoriesByRestaurant(
    IN p_restaurant_name VARCHAR(255)
)
BEGIN
    SELECT fc.CategoryName, fc.ImageURL
    FROM FoodCategory fc
    INNER JOIN Restaurant r ON fc.RestaurantID = r.RestaurantID
    WHERE r.RestaurantName = p_restaurant_name
    ORDER BY fc.CategoryName;
END$$

-- Get all food items by restaurant name
CREATE PROCEDURE sp_GetFoodItemsByRestaurant(
    IN p_restaurant_name VARCHAR(255)
)
BEGIN
    SELECT 
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
    GROUP BY f.ItemID, f.ItemName, f.ItemDescription, f.Price, f.ImageURL, c.CategoryName, r.RestaurantName
    ORDER BY c.CategoryName, f.ItemName;
END$$

-- Get food items by category name
CREATE PROCEDURE sp_GetFoodItemsByCategory(
    IN p_category_name VARCHAR(100)
)
BEGIN
    SELECT 
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
    GROUP BY f.ItemID, f.ItemName, f.ItemDescription, f.Price, f.ImageURL, c.CategoryName, r.RestaurantName
    ORDER BY f.ItemName;
END$$

CREATE PROCEDURE sp_GetFoodItemsByCategoryAndRestaurant(
    IN p_category_name VARCHAR(100),
    IN p_restaurant_name VARCHAR(200)
)
BEGIN
    SELECT 
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
    GROUP BY f.ItemID, f.ItemName, f.ItemDescription, f.Price, f.ImageURL, c.CategoryName, r.RestaurantName
    ORDER BY f.ItemName;
END$$

-- Search food items
CREATE PROCEDURE sp_SearchFood(
    IN p_search VARCHAR(100)
)
BEGIN
    SELECT 
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
    WHERE f.ItemName LIKE CONCAT('%', p_search, '%')
       OR f.ItemDescription LIKE CONCAT('%', p_search, '%')
       OR r.RestaurantName LIKE CONCAT('%', p_search, '%')
    GROUP BY f.ItemID, f.ItemName, f.ItemDescription, f.Price, f.ImageURL, c.CategoryName, r.RestaurantName
    ORDER BY r.RestaurantName, f.ItemName;
END$$

DELIMITER ;

-- ============================================
-- 7. ADMIN - Add/Update/Delete Food Items (Name-Based)
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
    DELETE FROM FoodItems WHERE ItemName = p_item_name;
    SELECT 'Food item deleted successfully' AS message;
END$$

DELIMITER ;

-- ============================================
-- 8. SHOPPING CART PROCEDURES (Name-Based)
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_AddToCart(
    IN p_user_id INT,
    IN p_item_name VARCHAR(150),
    IN p_quantity INT,
    IN p_size VARCHAR(50)
)
BEGIN
    DECLARE v_cart_id INT;
    DECLARE v_item_id INT;
    DECLARE v_price DECIMAL(10,2);
    DECLARE v_cart_item_id INT;

    -- Get or create cart
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

    -- Get item details
    SELECT ItemID, Price INTO v_item_id, v_price 
    FROM FoodItems 
    WHERE ItemName = p_item_name 
    LIMIT 1;

    -- Check if item already in cart
    SELECT CartItemID INTO v_cart_item_id
    FROM CartItems
    WHERE CartID = v_cart_id AND ItemID = v_item_id AND Size = p_size
    LIMIT 1;

    IF v_cart_item_id IS NOT NULL THEN
        UPDATE CartItems
        SET Quantity = Quantity + p_quantity
        WHERE CartItemID = v_cart_item_id;
        SELECT 'Item quantity updated in cart' AS message;
    ELSE
        INSERT INTO CartItems (CartID, ItemID, Price, Quantity, Size)
        VALUES (v_cart_id, v_item_id, v_price, p_quantity, p_size);
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
        SELECT f.ItemName, f.ItemDescription, f.ImageURL,
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
    IN p_user_id INT,
    IN p_item_name VARCHAR(150),
    IN p_size VARCHAR(50),
    IN p_quantity INT
)
BEGIN
    DECLARE v_cart_id INT;
    DECLARE v_item_id INT;

    SELECT CartID INTO v_cart_id
    FROM Cart
    WHERE UserID = p_user_id
    ORDER BY Cart_date DESC
    LIMIT 1;

    SELECT ItemID INTO v_item_id
    FROM FoodItems
    WHERE ItemName = p_item_name
    LIMIT 1;

    IF p_quantity > 0 THEN
        UPDATE CartItems
        SET Quantity = p_quantity
        WHERE CartID = v_cart_id AND ItemID = v_item_id AND Size = p_size;
        SELECT 'Cart quantity updated' AS message;
    ELSE
        DELETE FROM CartItems 
        WHERE CartID = v_cart_id AND ItemID = v_item_id AND Size = p_size;
        SELECT 'Item removed from cart' AS message;
    END IF;
END$$

CREATE PROCEDURE sp_RemoveFromCart(
    IN p_user_id INT,
    IN p_item_name VARCHAR(150),
    IN p_size VARCHAR(50)
)
BEGIN
    DECLARE v_cart_id INT;
    DECLARE v_item_id INT;

    SELECT CartID INTO v_cart_id
    FROM Cart
    WHERE UserID = p_user_id
    ORDER BY Cart_date DESC
    LIMIT 1;

    SELECT ItemID INTO v_item_id
    FROM FoodItems
    WHERE ItemName = p_item_name
    LIMIT 1;

    DELETE FROM CartItems 
    WHERE CartID = v_cart_id AND ItemID = v_item_id AND Size = p_size;
    
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

DELIMITER ;

-- ============================================
-- 9. CHECKOUT & ORDER PROCEDURES (Name-Based)
-- ============================================
DELIMITER $$

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
        -- Cart items
        SELECT f.ItemName, f.ImageURL,
               ci.Quantity, ci.Price, ci.Size,
               (ci.Quantity * ci.Price) AS subtotal
        FROM CartItems ci
        JOIN FoodItems f ON ci.ItemID = f.ItemID
        WHERE ci.CartID = v_cart_id;

        -- Cart totals
        SELECT 
            COALESCE(SUM(Quantity * Price), 0) AS subtotal,
            5.00 AS delivery_fee,
            COALESCE(SUM(Quantity * Price), 0) + 5.00 AS total
        FROM CartItems
        WHERE CartID = v_cart_id;

        -- User info
        SELECT UserID, username, email
        FROM Users
        WHERE UserID = p_user_id;

        -- Shipping addresses
        SELECT AddressName, Address, PostalCode, City, Country
        FROM ShippingAddress
        WHERE UserID = p_user_id;

        -- Payment methods
        SELECT PaymentName, PaymentMethod, CardholderName,
               CONCAT('****', RIGHT(CardNumber, 4)) AS masked_card_number
        FROM Payment
        WHERE UserID = p_user_id;
    END IF;
END$$

CREATE PROCEDURE sp_PlaceOrder(
    IN p_user_id INT,
    IN p_address_name VARCHAR(100),
    IN p_payment_name VARCHAR(100),
    OUT p_order_number VARCHAR(50)
)
BEGIN
    DECLARE v_cart_id INT;
    DECLARE v_order_id INT;
    DECLARE v_shipping_address_id INT;
    DECLARE v_payment_id INT;
    DECLARE v_total_amount DECIMAL(10,2);
    DECLARE v_delivery_fee DECIMAL(10,2) DEFAULT 5.00;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error: Order placement failed' AS message, NULL AS order_number;
    END;

    START TRANSACTION;

    -- Get IDs from names
    SELECT ShippingAddressID INTO v_shipping_address_id
    FROM ShippingAddress
    WHERE UserID = p_user_id AND AddressName = p_address_name
    LIMIT 1;

    SELECT PaymentID INTO v_payment_id
    FROM Payment
    WHERE UserID = p_user_id AND PaymentName = p_payment_name
    LIMIT 1;

    -- Get cart
    SELECT CartID INTO v_cart_id
    FROM Cart
    WHERE UserID = p_user_id
    ORDER BY Cart_date DESC
    LIMIT 1;

    IF v_cart_id IS NULL THEN
        ROLLBACK;
        SELECT 'No cart found for user' AS message, NULL AS order_number;
    ELSE
        -- Calculate total
        SELECT COALESCE(SUM(Quantity * Price), 0) INTO v_total_amount
        FROM CartItems
        WHERE CartID = v_cart_id;

        -- Insert order
        INSERT INTO Orders (UserID, OrderDate, TotalAccount, DeliveryFee, ShippingAddressID, PaymentID)
        VALUES (p_user_id, NOW(), v_total_amount, v_delivery_fee, v_shipping_address_id, v_payment_id);

        SET v_order_id = LAST_INSERT_ID();
        SET p_order_number = CONCAT('ORD-', LPAD(v_order_id, 8, '0'));

        -- Insert order items
        INSERT INTO OrderItems (OrderID, ItemID, Quantity, Price)
        SELECT v_order_id, ItemID, Quantity, Price
        FROM CartItems
        WHERE CartID = v_cart_id;

        -- Clear cart
        DELETE FROM CartItems WHERE CartID = v_cart_id;

        COMMIT;

        SELECT p_order_number AS order_number, 'Order placed successfully' AS message;
    END IF;
END$$

CREATE PROCEDURE sp_GetOrderByNumber(
    IN p_order_number VARCHAR(50)
)
BEGIN
    DECLARE v_order_id INT;
    
    SET v_order_id = CAST(SUBSTRING(p_order_number, 5) AS UNSIGNED);

    -- Order details
    SELECT CONCAT('ORD-', LPAD(o.OrderID, 8, '0')) AS order_number,
           o.UserID, u.username, u.email,
           o.OrderDate, o.TotalAccount, o.DeliveryFee,
           (o.TotalAccount + o.DeliveryFee) AS grand_total,
           sa.AddressName, sa.Address, sa.PostalCode, sa.City, sa.Country,
           pm.PaymentName, pm.PaymentMethod, pm.CardholderName,
           CONCAT('****', RIGHT(pm.CardNumber, 4)) AS masked_card_number
    FROM Orders o
    LEFT JOIN Users u ON o.UserID = u.UserID
    LEFT JOIN ShippingAddress sa ON o.ShippingAddressID = sa.ShippingAddressID
    LEFT JOIN Payment pm ON o.PaymentID = pm.PaymentID
    WHERE o.OrderID = v_order_id;
    
    -- Order items
    SELECT f.ItemName, f.ItemDescription, f.ImageURL,
           oi.Quantity, oi.Price, (oi.Quantity * oi.Price) AS subtotal
    FROM OrderItems oi
    JOIN FoodItems f ON oi.ItemID = f.ItemID
    WHERE oi.OrderID = v_order_id;
END$$

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
-- 10. REVIEW PROCEDURES (Name-Based)
-- ============================================
DELIMITER $$

CREATE PROCEDURE sp_AddReview(
    IN p_user_id INT,
    IN p_item_name VARCHAR(150),
    IN p_rating INT,
    IN p_review TEXT
)
BEGIN
    DECLARE v_item_id INT;

    SELECT ItemID INTO v_item_id
    FROM FoodItems
    WHERE ItemName = p_item_name
    LIMIT 1;

    INSERT INTO Reviews (UserID, ItemID, Rating, Review)
    VALUES (p_user_id, v_item_id, p_rating, p_review);

    SELECT 'Review added successfully' AS message;
END$$

CREATE PROCEDURE sp_GetItemReviewsByName(
    IN p_item_name VARCHAR(150)
)
BEGIN
    SELECT 
        u.username,
        f.ItemName,
        r.Rating,
        r.Review
    FROM Reviews r
    JOIN Users u ON r.UserID = u.UserID
    JOIN FoodItems f ON r.ItemID = f.ItemID
    WHERE f.ItemName = p_item_name
    ORDER BY r.ReviewID DESC;
END$$

CREATE PROCEDURE sp_GetAverageRatingByName(
    IN p_item_name VARCHAR(150)
)
BEGIN
    SELECT 
        COALESCE(AVG(r.Rating), 0) AS avg_rating,
        COUNT(r.ReviewID) AS review_count
    FROM Reviews r
    JOIN FoodItems f ON r.ItemID = f.ItemID
    WHERE f.ItemName = p_item_name;
END$$

CREATE PROCEDURE sp_UpdateReviewByUserAndItem(
    IN p_user_id INT,
    IN p_item_name VARCHAR(150),
    IN p_rating INT,
    IN p_review TEXT
)
BEGIN
    UPDATE Reviews r
    JOIN FoodItems f ON r.ItemID = f.ItemID
    SET r.Rating = p_rating,
        r.Review = p_review
    WHERE r.UserID = p_user_id
      AND f.ItemName = p_item_name;

    SELECT 'Review updated successfully' AS message;
END$$

CREATE PROCEDURE sp_DeleteReviewByUserAndItem(
    IN p_user_id INT,
    IN p_item_name VARCHAR(150)
)
BEGIN
    DELETE r
    FROM Reviews r
    JOIN FoodItems f ON r.ItemID = f.ItemID
    WHERE r.UserID = p_user_id
      AND f.ItemName = p_item_name;

    SELECT 'Review deleted successfully' AS message;
END$$

CREATE PROCEDURE sp_GetUserReviewsWithDetails(
    IN p_user_id INT
)
BEGIN
    SELECT 
        f.ItemName,
        f.imageURL AS ItemImageURL,
        r.Rating,
        r.Review,
        res.RestaurantName
    FROM Reviews r
    JOIN FoodItems f ON r.ItemID = f.ItemID
    JOIN Restaurant res ON f.RestaurantID = res.RestaurantID
    WHERE r.UserID = p_user_id
    ORDER BY r.ReviewID DESC;
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
    SELECT DATE(OrderDate) AS report_date,
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
        SUM(CASE WHEN Rating = 5 THEN 1 ELSE 0 END) AS five_star,
        SUM(CASE WHEN Rating = 4 THEN 1 ELSE 0 END) AS four_star,
        SUM(CASE WHEN Rating = 3 THEN 1 ELSE 0 END) AS three_star,
        SUM(CASE WHEN Rating = 2 THEN 1 ELSE 0 END) AS two_star,
        SUM(CASE WHEN Rating = 1 THEN 1 ELSE 0 END) AS one_star
    FROM Reviews;
END$$

DELIMITER ;