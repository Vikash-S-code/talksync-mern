import { compare } from "bcrypt";
import userModel from "../models/UserModel.js";
import { createToken } from "../utils/creatingUserToken.js";
import { renameSync, unlinkSync } from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MAX_AGE = 3 * 24 * 60 * 60 * 1000;

export const signupController = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
      return res.json({
        message: "Email, Password, ConfirmPassword required ",
        success: false,
        error: false,
      });
    }
    const checkUserExit = await userModel.findOne({ email });
    if (checkUserExit) {
      return res.json({
        message: "User already registered",
        success: false,
        error: true,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and ConfirmPassword must be same",
        success: false,
        error: true,
      });
    }

    const payload = {
      email: email,
      password: password,
    };

    const user = await userModel.create(payload);

    const token = createToken({ email, userId: user.id });

    res.cookie("jwt", token, {
      maxAge: MAX_AGE,
      secure: true,
      sameSite: "none",
      httpOnly: true,
    });

    if (user) {
      return res.status(200).json({
        message: "User registered successfully",
        userData: user,
        token: token,
        success: true,
        error: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        message: "Email, Password required ",
        success: false,
        error: false,
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        message: "User not registered yet",
        success: false,
        error: true,
      });
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      res.json({
        message: "Please check your password",
        success: false,
        error: true,
      });
    }
    res.cookie("jwt", createToken({ email, userId: user.id }), {
      maxAge: MAX_AGE,
      secure: true,
      sameSite: "none",
      httpOnly: true,
    });

    return res.status(200).json({
      message: "User Logged in ..",
      success: true,
      error: false,
      userData: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId);
    if (!userData) {
      return res.status(404).send("User with the given id not found..");
    }
    return res.status(200).json({
      userData,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName || color === undefined || color === null) {
      return res.json({
        message: "FirsName, lastName and color is required..",
        success: false,
        error: true,
      });
    }

    const userData = await userModel.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetUP: true,
      },
      { new: true, runValidators: true }
    );

    if (!userData) {
      return res.status(500).json({
        message: "Somthing went wrong...",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      error: false,
      userData,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

export const uploadProfileAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required..");
    }
    const date = Date.now();
    let fileName = `${date}-${req.file.originalname}`;
    const targetPath = path.join(
      process.cwd(),
      "uploads",
      "profiles",
      fileName
    );
    renameSync(req.file.path, targetPath);
    const updatedUserData = await userModel.findByIdAndUpdate(
      req.userId,
      { image: `uploads/profiles/${fileName}` },
      { new: true, runValidators: true }
    );
    return res.json({
      message: "Avatar uploaded..",
      success: true,
      error: false,
      image: updatedUserData.image,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

export const removeProfileImage = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    res.status(200).send("Logout successfully..");
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};
