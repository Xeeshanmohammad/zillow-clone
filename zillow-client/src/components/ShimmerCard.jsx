import React from "react";

function ShimmerCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-60 bg-gray-300"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-2/5"></div>
      </div>
    </div>
  );
}

export default ShimmerCard;
