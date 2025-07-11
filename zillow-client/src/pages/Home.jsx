import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import RateProperty from "../components/RatingProp";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchProperties = () => {
    axios
      .get("https://zillow-clone-0p80.onrender.com/api/properties/getAllProp")
      .then((res) => setProperties(res.data))
      .catch((err) => console.error(err));
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(
        `https://zillow-clone-0p80.onrender.com/api/properties/${id}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      navigate("/view-property", { state: { property: res.data } });
    } catch (err) {
      alert("Failed to fetch property details");
    }
  };

  const handleRate = async (id, value) => {
    try {
      await axios.post(
        `https://zillow-clone-0p80.onrender.com/api/properties/${id}/rating`,
        { value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchProperties(); // refresh updated rating
    } catch (err) {
      console.error("Rating failed:", err);
      alert("Failed to submit rating.");
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-6 bg-white shadow z-50">
        <h1 className="text-2xl font-bold text-blue-900">Zillow Properties</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-2 bg-blue-900 text-white rounded font-bold hover:bg-blue-700 transition cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 bg-blue-900 text-white rounded font-bold hover:bg-green-700 transition cursor-pointer"
          >
            Signup
          </button>
        </div>
      </header>

      <main className="px-8 pt-[100px]">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 mt-6">
          Featured Properties
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {properties?.map((property) => (
            <div
              key={property._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={
                  property.images?.[0] ||
                  "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&q=60&w=1000"
                }
                alt={property.title}
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {property.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  {property.address}
                </p>
                <p className="text-green-700 font-semibold mb-1">
                  AED {property?.price?.toLocaleString()}
                </p>

                {property.averageRating ? (
                  <RateProperty
                    value={property.averageRating}
                    readOnly={!token}
                    onChange={(val) => handleRate(property._id, val)}
                  />
                ) : (
                  <p className="text-xs text-gray-400 mb-2">No ratings yet</p>
                )}

                <Link
                  onClick={() => handleView(property._id)}
                  className="inline-block text-sm text-blue-600 font-medium hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="text-center text-sm text-gray-500 py-2">
        <p>© 2025 Powered By Code with Zeeshan.</p>
      </div>
    </div>
  );
};

export default Home;
