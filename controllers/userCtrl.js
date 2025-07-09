import bcrypt from "bcryptjs";
import User from "../models/UserSchema.js";
import { generateToken } from "../utils/GenerateToken.js";

export default class UserCtrl {
  static async createdUser(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists)
        return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
      });

      const createdUser = await user.save();

      res.status(201).json({
        success: true,
        msg: "User Created Successfull",
        _id: createdUser._id,
        email: createdUser.email,
        isAdmin: createdUser.role === "admin",
        token: generateToken(createdUser._id),
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user)
        return res.status(400).json({ message: "Invalid email or password" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid email or password" });

      const token = generateToken(user._id);

      res.json({
        success: true,
        msg: "Successsfull login",
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user._id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
}
