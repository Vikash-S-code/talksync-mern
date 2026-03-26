import { Router } from "express";
import {
  getContactDmList,
  searchContacts,
} from "../controllers/ContactController.js";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContacts);
contactRoutes.get("/get-dm-contacts", verifyToken, getContactDmList);

export default contactRoutes;
