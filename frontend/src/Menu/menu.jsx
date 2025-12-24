import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import MenuFoodCard from "../Components/menuFoodCard";
import { getRestaurantMenu, searchRestaurantItems } from "../services/menuApi";

export function Menu() {
  const { restaurantName } = useParams();
  const location = useLocation();
  const decodedRestaurantName = decodeURIComponent(restaurantName);

  // ✅ Load image from state, localStorage, or fallback
  const passedImage =
    location.state?.restaurantImageUrl ||
    localStorage.getItem("selectedRestaurantImage") ||
    "/restaurant.jpg";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [restaurantMenu, setRestaurantMenu] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch menu data
  useEffect(() => {
    async function fetchMenuData() {
      try {
        setLoading(true);
        const res = await getRestaurantMenu(decodedRestaurantName);
        const categories = res.data.data.categories || [];

        // Flatten items for easier use
        const allItems = categories.flatMap((cat) =>
          cat.items.map((item) => ({
            ...item,
            category_name: cat.category_name,
            RestaurantName: decodedRestaurantName,
          }))
        );

        setRestaurantMenu(allItems);

        // ✅ Store categories with their image URLs from API
        setAvailableCategories([
          { category_name: "All", image_url: null },
          ...categories.map((cat) => ({
            category_name: cat.category_name,
            image_url: cat.image_url,
          })),
        ]);

        setRestaurantDetails({
          name: decodedRestaurantName,
          imageUrl: passedImage,
        });
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMenuData();
  }, [decodedRestaurantName, passedImage]);

  // ✅ Save restaurant image for persistence
  useEffect(() => {
    if (passedImage) {
      localStorage.setItem("selectedRestaurantImage", passedImage);
    }
  }, [passedImage]);

  // ✅ Handle search (with debounce)
  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        if (!searchTerm.trim()) {
          const res = await getRestaurantMenu(decodedRestaurantName);
          const categories = res.data.data.categories || [];
          const allItems = categories.flatMap((cat) =>
            cat.items.map((item) => ({
              ...item,
              category_name: cat.category_name,
              RestaurantName: decodedRestaurantName,
            }))
          );
          setRestaurantMenu(allItems);
          return;
        }

        const res = await searchRestaurantItems(decodedRestaurantName, searchTerm);
        const results = res.data.data.results || [];
        const normalized = results.map((item) => ({
          ...item,
          RestaurantName: decodedRestaurantName,
        }));
        setRestaurantMenu(normalized);
      } catch (e) {
        console.error("Error searching menu items:", e);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm, decodedRestaurantName]);

  const displayedItems =
    selectedCategory === "All"
      ? restaurantMenu
      : restaurantMenu.filter((item) => item.category_name === selectedCategory);

  return (
    <section className="py-5">
      <div className="container" style={{ paddingTop: "80px" }}>
        {/* ✅ Restaurant Header */}
        {restaurantDetails && (
          <div className="text-center mb-5">
            <img
              src={
                restaurantDetails.imageUrl?.startsWith("http")
                  ? restaurantDetails.imageUrl
                  : restaurantDetails.imageUrl
              }
              alt={restaurantDetails.name}
              className="rounded-4 mb-3"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                border: "3px solid #81A4A6",
              }}
            />
            <h2 className="fw-bold">{restaurantDetails.name}</h2>
          </div>
        )}

        {/* 🔎 Search bar */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-6">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-lg rounded-pill ps-5"
                placeholder="Search food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i
                className="bi bi-search position-absolute"
                style={{
                  left: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "20px",
                  color: "#6c757d",
                }}
              ></i>
            </div>
          </div>
        </div>

        {/* 🍕 Categories */}
        <div className="overflow-auto mb-5" style={{ whiteSpace: "nowrap" }}>
          <div className="d-inline-flex gap-4 pb-3">
            {availableCategories.map((cat, index) => {
              const categoryImage = cat.image_url
                ? `/${cat.image_url}`
                : "/category-placeholder.jpg";

              return (
                <div
                  key={index}
                  className="text-center"
                  onClick={() => setSelectedCategory(cat.category_name)}
                  style={{
                    cursor: "pointer",
                    minWidth: "80px",
                    opacity: selectedCategory === cat.category_name ? 1 : 0.7,
                    transform:
                      selectedCategory === cat.category_name
                        ? "scale(1.1)"
                        : "scale(1)",
                    transition: "all 0.3s",
                  }}
                >
                  <div
                    className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center mx-auto mb-2"
                    style={{
                      width: "60px",
                      height: "60px",
                      border:
                        selectedCategory === cat.category_name
                          ? "3px solid #81A4A6"
                          : "none",
                      backgroundColor:
                        selectedCategory === cat.category_name ? "#fff" : "#f8f9fa",
                    }}
                  >
                    {cat.category_name !== "All" ? (
                      <img
                        src={categoryImage}
                        alt={cat.category_name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) =>
                          (e.currentTarget.src = "/category-placeholder.jpg")
                        }
                      />
                    ) : (
                      <span style={{ fontSize: "30px" }}>🍽️</span>
                    )}
                  </div>
                  <small
                    className={`${
                      selectedCategory === cat.category_name ? "fw-bold" : ""
                    }`}
                  >
                    {cat.category_name}
                  </small>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🍔 Menu items */}
        {loading ? (
          <div className="text-center py-5 text-muted">Loading...</div>
        ) : displayedItems.length > 0 ? (
          <div className="row g-4">
            {displayedItems.map((item, index) => (
              <MenuFoodCard key={index} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-5 text-muted">
            No items found matching your search.
          </div>
        )}
      </div>
    </section>
  );
}