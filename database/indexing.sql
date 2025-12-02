

/* ============================================
   USERS TABLE INDEXES
   Used for login, user lookup, role filtering
   ============================================ */
CREATE INDEX idx_users_email ON Users(email);         -- Fast login by email
CREATE INDEX idx_users_username ON Users(username);   -- Fast search by username
CREATE INDEX idx_users_role ON Users(role);           -- Filtering admins / users


/* ============================================
   FOOD CATEGORY INDEXES
   Used when searching by category name
   ============================================ */
CREATE INDEX idx_foodcategory_name ON FoodCategory(CategoryName);  -- Search category by name


/* ============================================
   FOOD ITEMS INDEXES
   Used for: category filtering, item name search,
   joins with Reviews and CartItems
   ============================================ */
CREATE INDEX idx_fooditems_categoryid ON FoodItems(CategoryID);  -- Get items by category quickly
CREATE INDEX idx_fooditems_itemname ON FoodItems(ItemName);      -- Search items by name


/* ============================================
   REVIEWS INDEXES
   Used when calculating item rating averages
   ============================================ */
CREATE INDEX idx_reviews_itemid ON Reviews(ItemID);   -- Fast aggregation of reviews per item


/* ============================================
   CART INDEXES
   Used for finding latest active cart for user
   ============================================ */
CREATE INDEX idx_cart_userid_date ON Cart(UserID, Cart_date);  
-- Get most recent cart for a user quickly (ORDER BY Cart_date DESC)


/* ============================================
   CART ITEMS INDEXES
   Used for updating quantity, removing items,
   loading cart contents, creating orders
   ============================================ */
CREATE INDEX idx_cartitems_cartid ON CartItems(CartID);         -- Get all cart items fast
CREATE INDEX idx_cartitems_cartitemid ON CartItems(CartItemID); -- Fast update/delete by CartItemID


/* ============================================
   SHIPPING ADDRESS INDEXES
   Used when loading checkout summary
   ============================================ */
CREATE INDEX idx_shippingaddress_userid ON ShippingAddress(UserID);  
-- Get user's saved addresses quickly


/* ============================================
   PAYMENT INDEXES
   Used for checkout to load payment methods
   ============================================ */
CREATE INDEX idx_payment_userid ON Payment(UserID);  
-- Get user's saved payment methods quickly


/* ============================================
   ORDERS INDEXES
   Used when showing user's order history
   ============================================ */
CREATE INDEX idx_orders_userid ON Orders(UserID);  
-- Fetch all orders for a user


/* ============================================
   ORDER ITEMS INDEXES
   Used while inserting order items and viewing order details
   ============================================ */
CREATE INDEX idx_orderitems_orderid ON OrderItems(OrderID);  -- Get all items in an order
CREATE INDEX idx_orderitems_itemid ON OrderItems(ItemID);    -- Join with FoodItems fast
