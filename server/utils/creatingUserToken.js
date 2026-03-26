import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const TOKEN_EXPIRY = "3d";
const JWT_SECRET = process.env.JWT_SECRET_CODE;
export const createToken = ({ email, userId }) => {
  if (!JWT_SECRET) {
    throw new Error("JWT secret is not defined in environment variables");
  }

  return jwt.sign({ email, userId }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
};
