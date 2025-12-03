
import React, { useEffect, useState } from "react";
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti";

function RatingStars({ Review_Count = 0, Star_Size = 18 }) {
  const [starCount, SetStarCount] = useState({ full: 0, half: 0, empty: 5 });

  useEffect(() => {
    const rating = Number(Review_Count) || 0;
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - hasHalf;
    SetStarCount({ full, half: hasHalf, empty });
  }, [Review_Count]);

  return (
    <div className="flex gap-1 text-yellow-100 items-center">
      {[...Array(starCount.full)].map((_, i) => (
        <TiStarFullOutline key={`f-${i}`} size={Star_Size} />
      ))}
      {[...Array(starCount.half)].map((_, i) => (
        <TiStarHalfOutline key={`h-${i}`} size={Star_Size} />
      ))}
      {[...Array(starCount.empty)].map((_, i) => (
        <TiStarOutline key={`e-${i}`} size={Star_Size} />
      ))}
    </div>
  );
}

export default RatingStars;
