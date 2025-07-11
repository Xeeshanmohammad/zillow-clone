import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PropertyAdd = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const invalidFiles = selectedFiles.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setError("Please upload only JPG, JPEG, PNG, or WEBP files.");
      setImages([]); // reset
    } else {
      setError("");
      setImages(selectedFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = new FormData();
    for (const key in formData) form.append(key, formData[key]);
    for (let i = 0; i < images.length; i++) {
      form.append("images", images[i]);
    }

    try {
      await axios.post(
        "https://zillow-clone-0p80.onrender.com/api/properties/create",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Property added successfully!");
      navigate(userRole === "admin" ? "/admin-dashboard" : "/user-dashboard");
    } catch (error) {
      console.error("Error adding property:", error);
      setError("Failed to add property");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(userRole === "admin" ? "/admin-dashboard" : "/user-dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded shadow mt-10">
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Add New Property
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Property Title"
          className="w-full border mb-3 p-2 rounded"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border mb-3 p-2 rounded"
          rows="3"
          onChange={handleChange}
          required
        ></textarea>
        <input
          name="price"
          type="number"
          placeholder="Price"
          className="w-full border mb-3 p-2 rounded"
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Address"
          className="w-full border mb-3 p-2 rounded"
          onChange={handleChange}
          required
        />

        <label className="block text-gray-700 font-medium mb-2">
          Upload Property Images
        </label>
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          className="w-full mb-4 border p-2"
          onChange={handleImageChange}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex justify-center items-center gap-2">
              <span className="loader border-white border-t-transparent"></span>
              Submitting...
            </div>
          ) : (
            "Submit Property"
          )}
        </button>
      </form>

      {/* Spinner styles */}
      <style>
        {`
          .loader {
            border: 3px solid;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default PropertyAdd;
