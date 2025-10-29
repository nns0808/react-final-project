import { useState } from "react";

function RatingStars({ rating = 0, onRate }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ cursor: "pointer", display: "inline-block" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            fontSize: "1.2rem",
            color: star <= (hovered || rating) ? "gold" : "gray",
            transition: "color 0.2s",
            marginRight: 2,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default RatingStars;
