import express from "express";
import PropertyCtrl from "../controllers/propertyCtrl.js";
import { authentic, adminOnly } from "../middleware/AuthMiddleware.js";
import upload from "../utils/Cloudinary.js";

const router = express.Router();

router.post(
  "/create",
  authentic,
  upload.array("images", 5),
  PropertyCtrl.createProp
);
router.get("/all-list", PropertyCtrl.allPropList);
router.get("/:id", PropertyCtrl.getPropById);
router.post("/:id/rating", authentic, PropertyCtrl.ratingProp);
router.put(
  "/:id",
  authentic,
  upload.array("images", 5),
  PropertyCtrl.updateProp
);
router.delete("/:id", authentic, adminOnly, PropertyCtrl.deleteProp);

export default router;
