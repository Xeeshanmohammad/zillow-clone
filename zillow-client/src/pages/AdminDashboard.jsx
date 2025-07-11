import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RateProperty from "../components/RatingProp";
import ShimmerCard from "../components/ShimmerCard";

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://zillow-clone-0p80.onrender.com/api/properties/all-list",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProperties(res.data);
    } catch (err) {
      setError("Failed to fetch properties");
    } finally {
      setLoading(false); 
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(
        "https://zillow-clone-0p80.onrender.com/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this property?");
    if (!confirm) return;
    try {
      await axios.delete(
        `https://zillow-clone-0p80.onrender.com/api/properties/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchProperties();
    } catch (err) {
      alert("Failed to delete property");
    }
  };

  const handleEdit = (prop) => {
    navigate("/edit-property", { state: { property: prop } });
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

  useEffect(() => {
    fetchProperties();
    fetchUserProfile();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
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
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/add-property")}
            className="px-2 py-2 bg-blue-900 font-bold text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            +Add Property
          </button>
          <button
            className="px-2 py-1 bg-red-600 font-bold text-white rounded hover:bg-red-300 cursor-pointer"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <ShimmerCard key={i} />)
          : properties.map((prop) => (
              <div
                key={prop._id}
                className="border-none rounded-xl p-4 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white"
              >
                <img
                  src={
                    prop?.images?.[0] ||
                    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?fm=jpg&q=60&w=3000"
                  }
                  alt={prop.title}
                  className="w-full h-60 object-cover rounded-md mb-3"
                />
                <h2 className="text-lg font-semibold">{prop.title}</h2>
                <p className="text-sm text-gray-600">{prop.address}</p>
                <p className="text-purple-700 font-bold mb-1">AED {prop.price}</p>
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
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleView(prop._id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(prop)}
                    className="px-3 py-1 text-sm bg-yellow-500 text-white rounded cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prop._id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
