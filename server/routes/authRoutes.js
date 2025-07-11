import express from "express";
import UserCtrl from "../controllers/userCtrl.js";
import { authentic } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/signup", UserCtrl.createdUser);
router.post("/login", UserCtrl.login);
router.get("/profile", authentic, UserCtrl.getProfile);

export default router;
