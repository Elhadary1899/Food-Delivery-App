import { useNavigate } from "react-router-dom";

export default function RestaurantHomeCard({ name, image, rating }) {
  const navigate = useNavigate();

  return (
    <button
      className="category-card d-flex flex-column align-items-center justify-content-center mx-2 p-3"
      style={{
        backgroundColor: "rgb(237, 243, 243)",
        borderRadius: "20px",
        border: "none",
        width: "120px",
        height: "160px",
        overflow: "hidden",
        position: "relative",
        transition: "transform 0.3s, box-shadow 0.3s",
      }}
      onClick={() =>
        navigate(`/menu/${encodeURIComponent(name)}`, {
          state: { restaurantImageUrl: image }, // ✅ pass image here
        })
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
      }}
    >
      <div className="category-image-wrapper mb-2" style={{ marginTop: "-0.5rem" }}>
        <img
          src={image}
          alt={name}
          className="img-fluid rounded-circle"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
            border: "2px solid white",
          }}
        />
      </div>

      <div
        className="text-center mb-1"
        style={{ fontSize: "0.85rem", fontWeight: "bold" }}
      >
        ⭐ {rating}
      </div>

      <h6
        className="fw-bold text-center"
        style={{ paddingBottom: 10, fontSize: "0.9rem" }}
      >
        {name}
      </h6>
    </button>
  );
}