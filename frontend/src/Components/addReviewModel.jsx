import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddReviewModal({ show, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");

  if (!show) return null; // don't render if not visible

  const handleSubmit = () => {
    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1060,
      }}
    >
      <div
        className="bg-white rounded-4 p-4 shadow text-center position-relative"
        style={{ width: "90%", maxWidth: "480px" }}
      >
        {/* ❌ Close button */}
        <button
          className="btn btn-link position-absolute top-0 end-0 m-2 text-danger"
          style={{ fontSize: "24px", textDecoration: "none" }}
          onClick={onClose}
        >
          ✖
        </button>

        {/* 📝 Modal Title */}
        <h4 className="fw-bold mb-4 mt-2">Add Your Review</h4>
        <p className="text-muted mb-2">Write A Comment (Optional)</p>

        {/* ⭐ Star rating */}
        <div className="mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={26}
              style={{ cursor: "pointer", margin: "4px" }}
              color={
                star <= (hover || rating)
                  ? "#FFC107"
                  : "rgba(0,0,0,0.2)"
              }
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </div>

        {/* 💬 Comment box */}
        <textarea
          className="form-control mb-4 text-center"
          rows="4"
          placeholder="Write Your Comment Here"
          style={{
            borderRadius: "10px",
            resize: "none",
          }}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* ✅ Submit Button */}
        <button
          className="btn text-white w-100 py-2"
          style={{
            backgroundColor: "#7FA9A3",
            borderRadius: "25px",
            fontSize: "16px",
            fontWeight: "500",
          }}
          onClick={handleSubmit}
        >
          Share Review
        </button>
      </div>
    </div>
  );
}