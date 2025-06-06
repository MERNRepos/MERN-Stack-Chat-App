const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { json } = require("express");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId params not sent with request");
    return res
      .sendStatus(400)
      .send({ message: "UserId params not sent with request" });
  }
  var isChat = Chat.find({
    isGroupChat: false,
    $and: [
      {
        users: { $elemMatch: { $eq: req.user._id } },
      },
      {
        users: { $elemMatch: { $eq: userId } },
      },
    ],
  }).populate("users", "-password", null, { strictPopulate: false });

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    return res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      return res.status(200).send(FullChat);
    } catch (error) {
      console.log("accessChat Error", error);
      throw new Error(error);
      return res.status(400);
    }
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  try {
    await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({
        updated: -1,
      })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    console.log("fetchChat Error", error);
    res.status(400);
    throw new Error("error");
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "please fill all the details" });
    }
    // var users = JSON.parse(req.body.users);
    var users = req.body.users;
    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group");
    }
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: req.body.users,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({
      _id: groupChat._id,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.log("createGroupChat Error", error);
    res.status(400);
    throw new Error(error);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat nor found");
    } else {
      return res.status(200).json(updatedChat);
    }
  } catch (error) {
    console.log("renameGroup Error", error);
    res.status(400);
    throw new Error(error);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat not found");
  }
  return res.status(200).json(added);
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("User not found");
  }
  return res.json(removed);
});

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
