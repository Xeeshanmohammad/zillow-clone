import React, { useEffect, useState } from "react";
import axios from "axios";
import { LogOut, Home, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RateProperty from "../components/RatingProp";

// 👉 ShimmerCard Component
const ShimmerCard = () => (
  <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
    <div className="w-full h-60 bg-gray-300 rounded-md mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
    <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="h-8 bg-gray-300 rounded w-full mb-2"></div>
  </div>
);

const UserDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(
        "https://zillow-clone-0p80.onrender.com/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://zillow-clone-0p80.onrender.com/api/properties/my-properties",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProperties(res.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(
        `https://zillow-clone-0p80.onrender.com/api/properties/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/view-property", { state: { property: res.data } });
    } catch (err) {
      alert("Failed to fetch property details");
    }
  };

  const handleEdit = (property) => {
    navigate("/edit-property", { state: { property } });
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirm) return;

    try {
      await axios.delete(
        `https://zillow-clone-0p80.onrender.com/api/properties/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProperties();
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Failed to delete property");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    fetchProperties();
    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-blue-800">
            Welcome {profile?.name || "User"}
          </h1>
          {profile && (
            <p className="text-sm font-bold text-gray-600 mt-1">
              Email: {profile.email}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/add-property")}
            className="flex items-center gap-1 px-2 py-2 bg-blue-900 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            +Add Property
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2 py-2 bg-red-500 text-white rounded hover:bg-red-400 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading
          ? Array.from({ length: 10 }).map((_, idx) => (
              <ShimmerCard key={idx} />
            ))
          : properties.map((prop) => (
              <div
                key={prop._id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <img
                  src={
                    prop.images?.[0] ||
                    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?fm=jpg&q=60&w=3000"
                  }
                  alt={prop.title}
                  className="w-full h-60 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {prop.title}
                </h2>
                <p className="text-gray-600 text-sm mb-1">{prop.address}</p>
                <p className="text-gray-800 font-bold mb-2">
                  AED {prop.price.toLocaleString()}
                </p>

                {prop.averageRating ? (
                  <div className="mb-2">
                    <RateProperty
                      value={Math.round(prop.averageRating)}
                      readOnly={true}
                    />
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mb-2">No ratings yet</p>
                )}

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleView(prop._id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Home className="w-4 h-4" /> View
                  </button>
                  <button
                    onClick={() => handleEdit(prop)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prop._id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default UserDashboard;
