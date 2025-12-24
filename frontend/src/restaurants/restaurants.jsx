import  { useEffect, useState } from "react";
import RestaurantCard from "../Components/restaurantCard";
import { getRestaurants, searchRestaurants } from "../services/restaurantApi";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Helper function to fix image URLs
  const resolveImageURL = (url) => {
    if (!url) return "/restaurant.jpg"; // fallback image

    // Special case: fix the known broken ibb.co URL
    if (url === "https://ibb.co/mrTqphqq") {
      return "/frontend/resources/IMG-8654.jpg";
    }

    // Keep all valid full URLs unchanged
    if (url.startsWith("http")) return url;

    // Fix local relative paths
    return `/${url.replace(/^\/?public[\\/]/, "").replace(/\\/g, "/")}`;
  };

  // ✅ Fetch all restaurants on initial load
  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true);
        const res = await getRestaurants();
        console.log("Restaurant API Response:", res.data);
        setRestaurants(res.data.data.restaurants);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  // ✅ Handle search functionality
  const handleSearchChange = async (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue.trim() === "") {
      const res = await getRestaurants();
      setRestaurants(res.data.data.restaurants);
      console.log(res.data.data.restaurants)
    } else {
      try {
        const res = await searchRestaurants(searchValue);
        setRestaurants(res.data.data.results);
      } catch (err) {
        console.error("Error searching restaurants:", err);
      }
    }
  };

  return (
    <div className="container py-5" style={{ paddingTop: "100px" }}>
      {/* Search bar */}
      <div
        className="row justify-content-center mb-4"
        style={{ marginTop: "100px" }}
      >
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg rounded-pill ps-4"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <h5 className="fw-bold mb-4">Available Restaurants</h5>

      {loading ? (
        <p className="text-center text-muted">Loading...</p>
      ) : restaurants.length > 0 ? (
        restaurants.map((rest, index) => (
          <RestaurantCard
            key={index}
            name={rest.restaurant_name}
            rating={rest.rating}
            // ✅ Apply the resolver here
            imageUrl={resolveImageURL(rest.image_url)}
            id={index}
          />
        ))
      ) : (
        <p className="text-center text-muted">No restaurants found.</p>
      )}
    </div>
  );
}