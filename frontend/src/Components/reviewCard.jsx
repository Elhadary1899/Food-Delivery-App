export default function ReviewCard({ review }) {
  return (
    <div
      key={review.username + review.review}
      className="card border-0 shadow-sm p-3"
      style={{
        minWidth: "250px",
        display: "inline-block",
        flex: "0 0 auto",
        borderRadius: "10px",
      }}
    >
      <h6 className="fw-bold mb-1">{review.username}</h6>

      {/* Stars */}
      <div className="mb-2 text-warning">
        {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
      </div>

      <p className="text-muted small">{review.review}</p>
    </div>
  );
}