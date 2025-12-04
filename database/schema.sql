-- =================================================
-- USERS
-- =================================================
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    PhoneNumber VARCHAR(20) NULL,
    password VARCHAR(200) NOT NULL,
    marketing_opt BOOLEAN DEFAULT TRUE,
    role VARCHAR(10) DEFAULT 'User',
    CHECK (email LIKE '%@gmail.com'),
    CHECK (role IN ('User','Admin'))
);

-- =================================================
-- SHIPPING ADDRESS
-- =================================================
CREATE TABLE ShippingAddress (
    ShippingAddressID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    AddressName VARCHAR(100),              -- Added from friend’s schema
    Address VARCHAR(200),
    PostalCode VARCHAR(20),
    City VARCHAR(100),
    Country VARCHAR(100),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- =================================================
-- PAYMENT METHODS
-- =================================================
CREATE TABLE Payment (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    PaymentName VARCHAR(100),              -- Added from friend’s schema
    PaymentMethod ENUM('Cash','Credit','Debit','MasterCard','Visa','PayPal'),
    CardholderName VARCHAR(100),
    CardNumber VARCHAR(30),
    ExpirationDate DATE,
    CVC VARCHAR(10),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- =================================================
-- Trigger: Card validation
-- =================================================
DROP TRIGGER IF EXISTS trg_payment_before_insert;
DELIMITER $$

CREATE TRIGGER trg_payment_before_insert
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
    -- No card required for Cash and PayPal
    IF NEW.PaymentMethod IN ('Cash', 'PayPal') THEN
        SET NEW.CardholderName = NULL;
        SET NEW.CardNumber = NULL;
        SET NEW.ExpirationDate = NULL;
        SET NEW.CVC = NULL;
    ELSE
        -- Card methods require full details
        IF NEW.CardholderName IS NULL
            OR NEW.CardNumber IS NULL
            OR NEW.ExpirationDate IS NULL
            OR NEW.CVC IS NULL THEN
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Card details are required for card payment methods';
        END IF;
    END IF;
END$$

DELIMITER ;

-- =================================================
-- FOOD CATEGORY
-- =================================================
CREATE TABLE FoodCategory (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL,
    ImageURL VARCHAR(255)
);

-- =================================================
-- RESTAURANTS
-- =================================================
CREATE TABLE Restaurant (
    RestaurantID INT AUTO_INCREMENT PRIMARY KEY,
    RestaurantName VARCHAR(200) NOT NULL,
    RestaurantRating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
    Address VARCHAR(200),
    imageURL VARCHAR(255)
);

-- =================================================
-- FOOD ITEMS
-- =================================================
CREATE TABLE FoodItems (
    ItemID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryID INT NOT NULL,
    RestaurantID INT NOT NULL,
    ItemName VARCHAR(150) NOT NULL,
    imageURL VARCHAR(255),
    ItemDescription VARCHAR(255),
    Price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (RestaurantID) REFERENCES Restaurant(RestaurantID) ON DELETE CASCADE
);

-- =================================================
-- ORDERS
-- =================================================
CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    OrderDate DATETIME NOT NULL,
    TotalAccount DECIMAL(10,2) NOT NULL,
    DeliveryFee DECIMAL(10,2) NOT NULL,
    ShippingAddressID INT NOT NULL,
    PaymentID INT NOT NULL,
    OrderStatus ENUM('Pending','Being Prepared','On The Way','Delivered','Cancelled')
        NOT NULL DEFAULT 'Pending',
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ShippingAddressID) REFERENCES ShippingAddress(ShippingAddressID) ON DELETE CASCADE,
    FOREIGN KEY (PaymentID) REFERENCES Payment(PaymentID) ON DELETE CASCADE
);

-- =================================================
-- ORDER ITEMS
-- =================================================
CREATE TABLE OrderItems (
    OrderItemID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT NOT NULL,
    ItemID INT NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE
);

-- =================================================
-- ORDER STATUS HISTORY (tracking)
-- =================================================
CREATE TABLE OrderStatusHistory (
    HistoryID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT NOT NULL,
    Status ENUM('Placed','Preparing','On The Way','Delivered','Cancelled'),
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID) ON DELETE CASCADE
);

-- =================================================
-- REVIEWS
-- =================================================
CREATE TABLE Reviews (
    ReviewID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    ItemID INT NOT NULL,
    Rating INT,
    Review VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (ItemID) REFERENCES FoodItems(ItemID) ON DELETE CASCADE,
    CHECK (Rating BETWEEN 1 AND 5)
);

-- =================================================
-- CART
-- =================================================
CREATE TABLE Cart (
    CartID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    Cart_date DATE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE CartItems (
    CartItemID INT AUTO_INCREMENT PRIMARY KEY,
    CartID INT NOT NULL,
    ItemID INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Quantity INT NOT NULL,
    Size VARCHAR(50),
    FOREIGN KEY (CartID) REFERENCES Cart(CartID) ON DELETE CASCADE
);

-- =================================================
-- COUPONS
-- =================================================
CREATE TABLE Coupons (
    CouponID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    CouponCode VARCHAR(50) NOT NULL,
    DiscountAmount DECIMAL(10,2) NOT NULL,
    DiscountType VARCHAR(20) NOT NULL,
    ExpiryDate DATE NOT NULL,
    IsUsed BOOLEAN DEFAULT FALSE,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    CHECK (DiscountType IN ('Percentage', 'Fixed'))
);