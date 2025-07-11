import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    address: String,
    images: [String],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
      ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      value: { type: Number, min: 1, max: 5 },
    },
  ],
  averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
