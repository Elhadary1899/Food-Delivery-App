// src/Components/MenuFoodCard.jsx
import { useNavigate } from "react-router-dom";

export default function MenuFoodCard({ item }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(
      `/product/${encodeURIComponent(item.RestaurantName)}/${encodeURIComponent(item.item_name)}`
    );
  };

  return (
    <div
      className="card border-0 shadow-sm"
      style={{
        borderRadius: "15px",
        width: "250px",
        margin: "10px",
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
      onClick={handleCardClick}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {/* 🖼️ Image */}
      <div
        className="bg-light p-4"
        style={{
          borderRadius: "15px 15px 0 0",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={`/${item.image_url}`}
          alt={item.item_name}
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* 🧾 Body */}
      <div className="card-body">
        <h5 className="fw-bold mb-2">{item.item_name}</h5>
        <p className="text-muted small mb-2">{item.description}</p>

        <div className="d-flex justify-content-between align-items-center">
          <span className="fs-5 fw-bold text-success">${item.price}</span>
          <small className="text-muted">
            ⭐ {item.avg_rating} ({item.review_count})
          </small>
        </div>
      </div>
    </div>
  );
}