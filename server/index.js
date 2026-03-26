import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import AuthRoutes from "./routes/AuthRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import SocketSetUp from "./Socket.js";

import path from "path";
import { fileURLToPath } from "url";
import messageRoute from "./routes/MessagesRoutes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URL;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(
  "/uploads/profiles",
  express.static(path.join(__dirname, "/uploads/profiles"))
);
app.use(
  "/uploads/files",
  express.static(path.join(__dirname, "/uploads/files"))
);

app.use("/api/auth", AuthRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messageRoute);

const server = app.listen(port, () => {
  console.log(`Server running on ${port} ...`);
});

SocketSetUp(server);

mongoose
  .connect(databaseUrl)
  .then(() => {
    console.log("Db Connection successful..");
  })
  .catch((err) => console.log(err.message));
