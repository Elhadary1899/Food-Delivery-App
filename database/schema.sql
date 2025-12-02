-- Create database and use it
CREATE DATABASE IF NOT EXISTS food_delivery_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE food_delivery_app;

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
    CHECK (email LIKE '%@gmail.com'),
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
    ExpirationDate DATE,
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
    RestaurantName VARCHAR(200) NOT NULL,
    RestaurantRating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
    Address VARCHAR(200),
    imageURL VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS FoodItems (
    ItemID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryID INT NOT NULL,
    RestaurantID INT NOT NULL,
    ItemName VARCHAR(150) NOT NULL,
    imageURL VARCHAR(255),
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
