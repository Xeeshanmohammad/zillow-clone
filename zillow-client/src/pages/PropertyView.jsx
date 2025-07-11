import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PropertyView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const prop = state?.property;

  const handleBack = () => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/user-dashboard");
    }
  };

  if (!prop) {
    return <p className="text-center mt-8">No property data available.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="p-8 m-8 max-w-2xl bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{prop.title}</h1>

        <img
          src={
            prop.images?.[0] ||
            "https://images.unsplash.com/photo-1582407947304-fd86f028f716?fm=jpg&q=60&w=3000"
          }
          alt={prop.title}
          className="w-full h-60 object-cover rounded-md mb-4"
        />

        <p className="text-gray-700 mb-2">{prop.description}</p>
        <p className="text-gray-700 mb-1 font-medium">📍 Address: {prop.address}</p>
        <p className="text-purple-700 font-bold mb-4 text-lg">AED {prop.price}</p>

        <button
          onClick={handleBack}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PropertyView;
