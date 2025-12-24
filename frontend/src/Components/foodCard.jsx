import React from "react";
import { useNavigate } from "react-router-dom";

export default function FoodCard({
  id,
  restaurantId,
  restaurantName,
  image,
  name,
  price,
  rating,
}) {
  const navigate = useNavigate();

  const handleShowItem = () => {
    const encodedRestaurant = encodeURIComponent(restaurantName);
    const encodedItem = encodeURIComponent(name);
    navigate(`/product/${encodedRestaurant}/${encodedItem}`);
  };

  return (
    <div
      className="card shadow-sm rounded-4 p-3 position-relative border-0"
      style={{
        width: "16rem",
        backgroundColor: "#EDF3F3",
        minWidth: "16rem",
        overflow: "hidden",
      }}
    >
      {/* Circular image - top-left */}
      <div
        className="position-absolute"
        style={{
          top: "0rem",
          left: "1rem",
          marginTop:"3px",
          marginBottom:"10px"
        }}
      >
        <div
          className="rounded-circle bg-white shadow-sm d-flex justify-content-center align-items-center"
          style={{
            width: "6.5rem",
            height: "6.5rem",
            overflow: "hidden",
            border: "4px solid #fff",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src={image}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* Rating badge */}
      <div className="position-absolute top-0 end-0 d-flex align-items-center gap-1 p-2">
        <span className="text-warning fs-5">★</span>
        <span className="text-secondary fw-medium">{rating}</span>
      </div>

      {/* Item info */}
      <div className="text-start mt-5 pt-5 mb-5">
        <h5 className="fw-semibold text-dark mb-1">{name}</h5>
        <p className="text-muted small mb-3">
          Available in:{" "}
          <span style={{ fontWeight: "bold" }}>{restaurantName}</span>
        </p>
      </div>

      {/* Bottom section */}
      <div className="d-flex justify-content-between align-items-center position-absolute bottom-0 start-0 w-100 px-3 pb-3">
        <button
          className="btn text-white"
          style={{
            backgroundColor: "#6CA89E",
            borderRadius: "20px",
            padding: "6px 16px",
            fontWeight: 500,
          }}
          onClick={handleShowItem}
        >
          Show Item
        </button>
        <span className="fw-semibold fs-5 text-dark">${price}</span>
      </div>
    </div>
  );
}