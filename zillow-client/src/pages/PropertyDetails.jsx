import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    axios.get(``)
      .then((res) => setProperty(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!property) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <img src={property.images[0]} className="w-full h-96 object-cover" alt={property.title} />
      <h1 className="text-3xl font-bold mt-4">{property.title}</h1>
      <p className="text-gray-600">{property.address}</p>
      <p className="mt-2">{property.description}</p>
      <p className="text-green-600 font-bold mt-2">₹ {property.price}</p>
    </div>
  );
};

export default PropertyDetails;