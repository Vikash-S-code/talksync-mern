import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";
import { getMessages, uploadFiles } from "../controllers/MessagesController.js";
import multer from "multer";

const messageRoute = Router();
const upload = multer({ dest: "uploads/files" });
messageRoute.post("/get-messages", verifyToken, getMessages);
messageRoute.post(
  "/upload-file",
  verifyToken,
  upload.single("file"),
  uploadFiles
);

export default messageRoute;
