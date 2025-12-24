import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReviewCard from "../Components/reviewCard";
import { useCart } from "../context/CartContext";
import AddReviewModal from "../Components/addReviewModel";
import FloatingMessageCard from "../Components/floatingMessageCard";
import { getItemDetails } from "../services/itemApi";
import { fetchReviews, addReview } from "../services/reviewsApi";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";


export default function ProductDetails() {
  const { restaurantName, itemName } = useParams();
  const { addToCart } = useCart();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [item, setItem] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Small");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewSubmitted, setShowReviewSubmitted] = useState(false);

  // Fetch item + reviews
  useEffect(() => {
    async function fetchItem() {
      try {
        setLoading(true);
        const res = await getItemDetails(restaurantName, itemName);
        const data = res.data.data;
        console.log(data.item);
        setItem(data.item);
        setRecommended(data.recommended || []);

        await loadReviews(
          data.item.restaurant_name || restaurantName,
          data.item.item_name
        );
      } catch (err) {
        console.error("Error fetching item details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [restaurantName, itemName]);

  // Fetch reviews helper
  const loadReviews = async (restaurant, item) => {
    try {
      const data = await fetchReviews(restaurant, item);
      setReviews(data.reviews || []);
      setAvgRating(data.avg_rating || 0);
      setReviewCount(data.review_count || (data.reviews?.length || 0));
    } catch (err) {
      console.error("Error loading reviews:", err);
    }
  };

  if (loading) return <p className="text-center py-5">Loading item details...</p>;
  if (!item) return <p className="text-center py-5">Product not found.</p>;

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // Secure Add-to-Cart Handler
  const handleAddToCart = async () => {
    if (!user || !token) {
      toast.info("Please sign in first to add items to your cart.");
      return navigate(`/auth/login?redirect=${encodeURIComponent(location.pathname)}`);
    }

    try {
      await addToCart(item, quantity, selectedSize, restaurantName);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (err) {
      toast.error("Failed to add to cart.");
    }
  };

  // Secure Review Submit Handler
  const handleReviewSubmit = async ({ rating, comment }) => {
    if (!user || !token) {
      toast.info("Please sign in first to add a review.");
      return navigate(`/auth/login?redirect=${encodeURIComponent(location.pathname)}`);
    }

    try {
      if (!rating) {
        toast.error("Please select a rating");
        return;
      }

      await addReview(
        {
          user_id: user.id, // from AuthContext
          restaurant_name: restaurantName,
          item_name: item.item_name,
          rating,
          review: comment,
        },
        token // JWT token
      );

      await loadReviews(restaurantName, item.item_name);
      setShowReviewModal(false);
      setShowReviewSubmitted(true);
      toast.success("Review added successfully!");
      setTimeout(() => setShowReviewSubmitted(false), 2500);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    }
  };

  const imageUrl = item.image_url ? `/${item.image_url}` : "/restaurant.jpg";

  return (
    <>
      {/* Product section */}
      <section className="py-5">
        <div className="container" style={{ marginTop: "70px" }}>
          <div className="row align-items-center">
            <div
              className="col-lg-6"
              style={{ width: "450px", marginRight: "70px", marginLeft: "50px" }}
            >
              <img
                src={imageUrl}
                alt={item.item_name}
                className="img-fluid rounded-4"
                style={{ objectFit: "cover", maxHeight: "400px" }}
              />
            </div>

            <div className="col-lg-6">
              <h2 className="fw-bold mb-3">{item.item_name}</h2>
              <div className="d-flex align-items-center mb-3">
                <span className="text-warning me-2">⭐</span>
                <span className="fw-bold">
                  {item.avg_rating} ({reviewCount})
                </span>
              </div>

              <p className="text-muted mb-4">{item.description}</p>

              {/* Quantity */}
              <div className="d-flex align-items-center mb-4">
                <button
                  className="btn btn-dark rounded-circle"
                  onClick={decrease}
                >
                  -
                </button>
                <span className="mx-4 fs-5 fw-bold">{quantity}</span>
                <button
                  className="btn btn-dark rounded-circle"
                  onClick={increase}
                >
                  +
                </button>
              </div>

              {/* Sizes */}
              <div className="d-flex gap-3 mb-4">
                {["Small", "Medium", "Large"].map((size) => (
                  <button
                    key={size}
                    className={`btn ${
                      selectedSize === size
                        ? "btn-dark"
                        : "btn-outline-secondary"
                    } px-4`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="d-flex align-items-center gap-4">
                <h3 className="fw-bold mb-0">${item.price}</h3>
                <button
                  className="btn btn-lg px-5 text-white"
                  style={{
                    backgroundColor: "#7FA9A3",
                    borderRadius: "30px",
                  }}
                  onClick={handleAddToCart}
                >
                  Add to Cart 🛒
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-5">
        <div className="container">
          <h3 className="fw-bold mb-4">Customer Reviews</h3>
          <div
            className="d-flex gap-4 pb-3"
            style={{ overflowX: "auto", whiteSpace: "nowrap" }}
          >
            {reviews.length > 0 ? (
              reviews.map((r, i) => <ReviewCard key={i} review={r} />)
            ) : (
              <p className="text-muted">No reviews yet.</p>
            )}
          </div>
        </div>

        {user ? (
          <button
            className="btn btn-lg px-5 text-white"
            style={{
              backgroundColor: "#7FA9A3",
              borderRadius: "30px",
              marginLeft: "75%",
              marginTop: "30px",
            }}
            onClick={() => setShowReviewModal(true)}
          >
            Add Review
          </button>
        ) : (
          <p className="text-muted text-end me-5">
            Sign in to add a review.
          </p>
        )}
      </section>


      {/* Floating messages */}
      {showSuccess && (
        <FloatingMessageCard message="Added to cart successfully!" />
      )}
      {showReviewSubmitted && (
        <FloatingMessageCard message="Review submitted successfully!" />
      )}

      {/* Modal */}
      <AddReviewModal
        show={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
}