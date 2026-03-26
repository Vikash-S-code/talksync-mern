import mongoose from "mongoose";
import userModel from "../models/UserModel.js";
import MessageModel from "../models/MessagesModel.js";

export const searchContacts = async (req, res) => {
  try {
    const { search } = req.body;

    if (search == undefined || search === null) {
      return res.status(400).send("Nothing to search...");
    }

    const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regx = new RegExp(sanitizedSearch, "gi");

    const contacts = await userModel.find({
      $and: [
        { _id: { $ne: req.userId } },
        { $or: [{ firstName: regx }, { lastName: regx }, { email: regx }] },
      ],
    });

    return res.status(200).json({
      contacts,
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

export const getContactDmList = async (req, res) => {
  try {
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await MessageModel.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $max: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      { $unwind: "$contactInfo" },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return res.status(200).json({
      contacts,
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
