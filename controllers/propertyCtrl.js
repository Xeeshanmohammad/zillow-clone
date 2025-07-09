import Property from "../models/PropertySchema.js";

export default class PropertyCtrl {
  static async createProp(req, res, next) {
    try {
      const { title, description, price, address } = req.body;
      const images = req.files.map((file) => file.path);

      const prop = new Property({
        title,
        description,
        price,
        address,
        images,
        owner: req.user.id,
      });

      await prop.save();
      res.status(201).json(prop);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  static async allPropList(req, res, next) {
    try {
      const props = await Property.find().sort({ createdAt: -1 });
      res.json(props);
    } catch (err) {
      next(err);
    }
  }

  static async getPropById(req, res, next) {
    try {
      const prop = await Property.findById(req.params.id).populate(
        "owner",
        "email"
      );
      if (!prop) return res.status(404).json({ message: "Not found" });
      res.json(prop);
    } catch (err) {
      next(err);
    }
  }

  static async updateProp(req, res, next) {
    try {
      const prop = await Property.findById(req.params.id);

      if (!prop) return res.status(404).json({ message: "Property not found" });

      const ownerId =
        typeof prop.owner === "object"
          ? prop.owner._id.toString()
          : prop.owner.toString();
      if (ownerId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedData = {
        ...req.body,
      };

      if (req.files && req.files.length > 0) {
        updatedData.images = req.files.map((file) => file.path);
      }

      const updatedProp = await Property.findByIdAndUpdate(
        req.params.id,
        { $set: updatedData },
        { new: true, runValidators: true }
      );

      res.status(200).json(updatedProp);
    } catch (err) {
      console.error("Update Error:", err);
      next(err);
    }
  }

  static async deleteProp(req, res, next) {
    try {
      const prop = await Property.findById(req.params.id);

      if (!prop) {
        return res.status(404).json({ message: "Property not found" });
      }

      await Property.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "Property deleted successfully" });
    } catch (err) {
      console.error("Delete Error:", err);
      next(err);
    }
  }

  static async ratingProp(req, res, next) {
    try {
      const { id } = req.params;
      const { value } = req.body;

      if (!value || value < 1 || value > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be between 1 and 5" });
      }

      const property = await Property.findById(id);
      if (!property)
        return res.status(404).json({ message: "Property not found" });

      const existingRating = property.ratings.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (existingRating) {
        existingRating.value = value;
      } else {
        property?.ratings?.push({ user: req.user._id, value });
      }
      const total = property.ratings.reduce((acc, r) => acc + r.value, 0);
      property.averageRating = total / property.ratings.length;

      await property.save();

      res.status(200).json({
        message: "Rating submitted successfully",
        averageRating: property.averageRating,
        ratings: property.ratings.length,
      });
    } catch (err) {
      console.error("Rating Error:", err);
      next(err);
    }
  }
}
