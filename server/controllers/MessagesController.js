import MessageModel from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";

export const getMessages = async (req, res) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return res.status(400).send("Both users are required...");
    }

    const messages = await MessageModel.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({
      messages,
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

export const uploadFiles = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File required...");
    }

    const date = Date.now();
    let fileDr = `uploads/files/${date}`;
    let fileName = `${fileDr}/${req.file.originalname}`;

    mkdirSync(fileDr, { recursive: true });

    renameSync(req.file.path, fileName);

    return res.status(200).json({
      filePath: fileName,
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
