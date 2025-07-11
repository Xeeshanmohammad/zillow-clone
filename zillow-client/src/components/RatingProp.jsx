import React from "react";

const RateProperty = ({ value = 0, readOnly = true, onChange }) => {
  const rounded = Math.round(value);

  return (
    <div className="flex gap-[2px] mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => !readOnly && onChange && onChange(star)}
          className={`w-5 h-5 ${
            rounded >= star ? "text-yellow-400" : "text-gray-300"
          } ${readOnly ? "cursor-default" : "cursor-pointer hover:text-yellow-500"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
        </svg>
      ))}
    </div>
  );
};

export default RateProperty;
