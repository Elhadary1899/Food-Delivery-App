import { createContext, useContext, useState, useEffect } from "react";
import {
  addToCartAPI,
  getCartAPI,
  removeFromCartAPI,
  incrementCartItemAPI,
  decrementCartItemAPI,
  clearCartAPI,
} from "../services/cartApi";
import { AuthContext } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (user && token) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [user, token]);

  // ✅ Fixed version with proper image support
  const loadCart = async () => {
    if (!token) return;

    try {
      const res = await getCartAPI(token);
      const data = res.data.data;

      // 🧩 handle empty/invalid cart response
      if (!data || !Array.isArray(data.items)) {
        setCartItems([]);
        return;
      }

      if (data.items.length === 0) {
        setCartItems([]);
        return;
      }

      // ✅ Map and normalize all fields (including image)
      const formatted = data.items
        .filter((item) => item && (item.Price || item.price))
        .map((item) => {
          // 🧩 Grab the image from all possible field names (now includes ImageURL)
          const rawImage =
            item.ImageURL || item.Image || item.image || item.image_url || "";

          // 🧩 Normalize slashes and enforce leading slash
          let normalizedImage = "/placeholder.jpg";
          if (rawImage) {
            const cleanedPath = rawImage.replace(/\\/g, "/");

            normalizedImage = cleanedPath.startsWith("http")
              ? cleanedPath
              : cleanedPath.startsWith("/")
                ? cleanedPath
                : "/" + cleanedPath; // 🔥 Force leading slash
          }

          console.log("Raw image:", rawImage, "→ Normalized:", normalizedImage);

          return {
            id: `${item.ItemName || item.item_name}-${item.Size || item.size}-${item.RestaurantName || item.restaurant_name || ""}`,
            ItemID: item.ItemID || item.item_id || null,
            name: item.ItemName || item.item_name || "Unnamed Item",
            price: Number(item.Price || item.price) || 0,
            quantity: Number(item.Quantity || item.quantity) || 0,
            size: item.Size || item.size || "Medium",
            restaurant: item.RestaurantName || item.restaurant_name || "",
            subtotal: Number(item.subtotal || item.Subtotal) || 0,
            image: normalizedImage, // ✅ now added
          };
        });

      setCartItems(formatted);
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data || err.message);
    }
  };

  const checkAuth = () => {
    if (!user || !token) {
      alert("Please sign in to perform this action.");
      return false;
    }
    return true;
  };

  const addToCart = async (product, quantity = 1, size = "Medium", restaurantName = "") => {
    if (!checkAuth()) return;

    const payload = {
      item_id: product.item_id,
      quantity,
      size,
    };

    try {
      await addToCartAPI(payload, token);
      // Manually add image locally while waiting for backend to update
      await loadCart();
      setCartItems(prev =>
        prev.map(i =>
          i.ItemID === product.item_id
            ? { ...i, image: product.image_url || product.image || "/placeholder.jpg" }
            : i
        )
      );
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const removeFromCart = async (id) => {
    if (!checkAuth()) return;
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const payload = { item_id: item.ItemID, size: item.size };

    try {
      await removeFromCartAPI(payload, token);
      setCartItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const increaseQty = async (id) => {
    if (!checkAuth()) return;
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const payload = { item_id: item.ItemID, size: item.size };
    try {
      await incrementCartItemAPI(payload, token);
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } catch (err) {
      console.error("Error incrementing quantity:", err);
    }
  };

  const decreaseQty = async (id) => {
    if (!checkAuth()) return;
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const payload = { item_id: item.ItemID, size: item.size };
    try {
      await decrementCartItemAPI(payload, token);

      if (item.quantity === 1) {
        setCartItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        setCartItems((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity - 1 } : i
          )
        );
      }
    } catch (err) {
      console.error("Error decrementing quantity:", err);
    }
  };

  const clearCart = async () => {
    if (!checkAuth()) return;
    try {
      await clearCartAPI(token);
      setCartItems([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        loadCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);