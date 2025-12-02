/* ============================================
   USERS TABLE INDEXES
   Used for login, user lookup, role filtering
   ============================================ */
CREATE INDEX idx_users_email ON Users(email);         -- Fast login by email
CREATE INDEX idx_users_username ON Users(username);   -- Fast login by username & search
CREATE INDEX idx_users_role ON Users(role);           -- Filtering admins / users

/* ============================================
   RESTAURANT INDEXES
   Used when browsing restaurants and filtering items
   ============================================ */
CREATE INDEX idx_restaurant_name ON Restaurant(Name);  -- Fast restaurant lookup by name

/* ============================================
   FOOD CATEGORY INDEXES
   Used when searching by category name and restaurant
   ============================================ */
CREATE INDEX idx_foodcategory_name ON FoodCategory(CategoryName);              -- Search category by name


/* ============================================
   FOOD ITEMS INDEXES
   Used for: category filtering, item name search,
   restaurant filtering, joins with Reviews and CartItems
   ============================================ */
CREATE INDEX idx_fooditems_categoryid ON FoodItems(CategoryID);           -- Get items by category quickly
CREATE INDEX idx_fooditems_restaurantid ON FoodItems(RestaurantID);       -- Get items by restaurant quickly
CREATE INDEX idx_fooditems_itemname ON FoodItems(ItemName);               -- Search items by name (MOST USED)
CREATE INDEX idx_fooditems_restaurant_category ON FoodItems(RestaurantID, CategoryID);  -- Combined filtering


/* ============================================
   REVIEWS INDEXES
   Used when calculating item rating averages
   ============================================ */
CREATE INDEX idx_reviews_itemid ON Reviews(ItemID);        -- Fast aggregation of reviews per item
CREATE INDEX idx_reviews_userid ON Reviews(UserID);        -- Get user's reviews quickly

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
CREATE INDEX idx_cartitems_cartid ON CartItems(CartID);                    -- Get all cart items fast
CREATE INDEX idx_cartitems_itemid ON CartItems(ItemID);                    -- Join with FoodItems
CREATE INDEX idx_cartitems_cart_item_size ON CartItems(CartID, ItemID, Size);  -- Unique item+size lookup (MOST USED)

/* ============================================
   SHIPPING ADDRESS INDEXES
   Used when loading checkout summary and order placement
   ============================================ */
CREATE INDEX idx_shippingaddress_userid ON ShippingAddress(UserID);  
-- Get user's saved addresses quickly
CREATE INDEX idx_shippingaddress_userid_name ON ShippingAddress(UserID, Address);  
-- Fast lookup by user and address name (MOST USED for name-based operations)

/* ============================================
   PAYMENT INDEXES
   Used for checkout to load payment methods
   ============================================ */
CREATE INDEX idx_payment_userid ON Payment(UserID);  
-- Get user's saved payment methods quickly
CREATE INDEX idx_payment_userid_name ON Payment(UserID, CardNumber);  
-- Fast lookup by user and payment name (MOST USED for name-based operations)

/* ============================================
   ORDERS INDEXES
   Used when showing user's order history
   ============================================ */
CREATE INDEX idx_orders_userid ON Orders(UserID);           -- Fetch all orders for a user
CREATE INDEX idx_orders_orderdate ON Orders(OrderDate);     -- Date range queries for reports
CREATE INDEX idx_orders_userid_date ON Orders(UserID, OrderDate);  -- User order history sorted by date

/* ============================================
   ORDER ITEMS INDEXES
   Used while inserting order items and viewing order details
   ============================================ */
CREATE INDEX idx_orderitems_orderid ON OrderItems(OrderID);  -- Get all items in an order
CREATE INDEX idx_orderitems_itemid ON OrderItems(ItemID);    -- Join with FoodItems fast

/* ============================================
   COMPOSITE INDEXES FOR COMMON QUERY PATTERNS
   These cover multiple columns used together frequently
   ============================================ */

-- For sp_GetFoodItemsByRestaurant with category grouping
CREATE INDEX idx_fooditems_rest_cat_name ON FoodItems(RestaurantID, CategoryID, ItemName);

-- For review queries joining users and items
CREATE INDEX idx_reviews_item_user ON Reviews(ItemID, UserID);

-- For cart operations with item and size
CREATE INDEX idx_cartitems_complete ON CartItems(CartID, ItemID, Size, Quantity);