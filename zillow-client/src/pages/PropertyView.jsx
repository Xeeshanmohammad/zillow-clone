import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import RateProperty from "../components/RatingProp";

const PropertyView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const prop = state?.property;

  const token = localStorage.getItem("token");
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(prop?.averageRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    const role = localStorage.getItem("role");
    navigate(role === "admin" ? "/admin-dashboard" : "/user-dashboard");
  };

  const handleRate = async (value) => {
    if (!token) {
      alert("Login to rate this property.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post(
        `https://zillow-clone-0p80.onrender.com/api/properties/${prop._id}/rating`,
        { value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserRating(value);
      setAvgRating(res.data.averageRating);
    } catch (err) {
      alert("Failed to submit rating");
    } finally {
      setIsSubmitting(false);
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
        <p className="text-gray-700 mb-1 font-medium">
          📍 Address: {prop.address}
        </p>
        <p className="text-purple-700 font-bold mb-4 text-lg">
          AED {prop.price}
        </p>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            ⭐ Rate this Property
          </h2>

          <RateProperty
            value={userRating || Math.round(avgRating)}
            readOnly={!token}
            onChange={handleRate}
          />

          {isSubmitting ? (
            <p className="text-sm text-blue-500">Submitting rating...</p>
          ) : (
            <p className="text-sm text-gray-600">
              Average Rating: {avgRating?.toFixed(1)} ⭐
            </p>
          )}
        </div>

        <button
          onClick={handleBack}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PropertyView;
