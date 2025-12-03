-- =================================================
-- PROFILE MODULE SCHEMA UPDATES
-- =================================================

USE food_delivery_app;

-- Add PhoneNumber to Users table
ALTER TABLE Users 
ADD COLUMN PhoneNumber VARCHAR(20) NULL AFTER email;

-- Add OrderStatus to Orders table
ALTER TABLE Orders 
ADD COLUMN OrderStatus VARCHAR(20) DEFAULT 'Pending' AFTER PaymentID;

-- Create Coupons table
CREATE TABLE IF NOT EXISTS Coupons (
    CouponID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    CouponCode VARCHAR(50) NOT NULL,
    DiscountAmount DECIMAL(10,2) NOT NULL,
    DiscountType VARCHAR(20) NOT NULL, -- 'Percentage' or 'Fixed'
    ExpiryDate DATE NOT NULL,
    IsUsed BOOLEAN DEFAULT FALSE,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    CHECK (DiscountType IN ('Percentage', 'Fixed'))
);

-- Update existing orders to have a status (default to Completed for existing orders)
UPDATE Orders SET OrderStatus = 'Completed' WHERE OrderStatus IS NULL OR OrderStatus = '';

