import { Router } from "express";
import {
  getUserInfo,
  loginController,
  logoutController,
  removeProfileImage,
  signupController,
  updateProfile,
  uploadProfileAvatar,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";

import multer from "multer";

const AuthRoutes = Router();
const upload = multer({ dest: "uploads/profiles/" });

AuthRoutes.post("/signup", signupController);
AuthRoutes.post("/login", loginController);
AuthRoutes.get("/user-info", verifyToken, getUserInfo);
AuthRoutes.post("/update-profile", verifyToken, updateProfile);
AuthRoutes.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  uploadProfileAvatar
);
AuthRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
AuthRoutes.post("/logout", verifyToken, logoutController);

export default AuthRoutes;
