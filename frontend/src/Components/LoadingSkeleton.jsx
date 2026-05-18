import React from "react";
import Skeleton from "./ui/Skeleton";

export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <Skeleton key={idx} className="h-56 w-full" />
      ))}
    </div>
  );
}
