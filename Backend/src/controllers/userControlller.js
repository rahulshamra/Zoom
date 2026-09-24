import { User } from "../models/userSchema.js";
import httpStatus from "http-status";
<<<<<<< HEAD
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { Meeting } from "../models/mettingSchema.js";

const getUsers = async (req, res) => {
  const data = await User.find({}, { _id: 1, username: 1 });
  res.json(data);
}

const getCurrentUser = async (req, res) => {
  return res.json({
    message: "JWT verified",
    payload: req.user,
  });
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

const joinMeeting = async (req, res) => {
  try {
    const meetingName = req.body.meetingName?.trim();
    if (!meetingName) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Meeting name is required" });
    }

    const meeting = await Meeting.findOneAndUpdate(
      { meetingName },
      { $setOnInsert: { meetingName } },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
    );

    await User.findByIdAndUpdate(req.user.id, { $addToSet: { meetings: meeting._id } });
    return res.status(200).json({
      meetingId: meeting._id,
      meetingName: meeting.meetingName,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Unable to join meeting" });
  }
}

const getMeetings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({ path: "meetings", select: "meetingName meetingStartDate chatHistory" });
    const meetings = (user?.meetings || []).sort(
      (first, second) => second.meetingStartDate - first.meetingStartDate
    );
    return res.json(meetings);
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Unable to load meetings" });
  }
}

const getChatHistory = async (req, res) => {
  try {
    const hasAccess = await User.exists({ _id: req.user.id, meetings: req.params.meetingId });
    const meeting = hasAccess
      ? await Meeting.findById(req.params.meetingId).select("chatHistory meetingName")
      : null;

    if (!meeting) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Meeting Not Found" });
    }

    return res.json({ meetingName: meeting.meetingName, chatHistory: meeting.chatHistory });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
}

const clearChatHistory = async (req, res) => {
  try {
    const hasAccess = await User.exists({ _id: req.user.id, meetings: req.params.meetingId });
    const meeting = hasAccess ? await Meeting.findOneAndUpdate(
      { _id: req.params.meetingId },
      { $set: { chatHistory: [] } },
      { returnDocument: "after" }
    ) : null;

    if (!meeting) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Meeting Not Found" });
    }

    return res.json({ message: "Chat history cleared" });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
}

const deleteChatMessage = async (req, res) => {
  try {
    const hasAccess = await User.exists({ _id: req.user.id, meetings: req.params.meetingId });
    const meeting = hasAccess ? await Meeting.findOneAndUpdate(
      { _id: req.params.meetingId, "chatHistory._id": req.params.messageId },
      { $pull: { chatHistory: { _id: req.params.messageId } } },
      { returnDocument: "after" }
    ) : null;

    if (!meeting) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Message Not Found" });
    }

    return res.json({ message: "Chat message deleted" });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
=======
import bcrypt, { hash } from 'bcrypt';
import crypto from "crypto";

const getUsers = async (req, res) => {
  const data = await User.find({});
  res.json(data);
  console.log(data);
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
}
// signupUser
const signUpUser = async (req, res) => {
  try {
<<<<<<< HEAD
    const username = req.body.username?.trim();
    const password = req.body.password;

    if (!username || !password) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Username and password are required" });
    }

    const existUser = await User.findOne({ username });
    if (existUser) {
      return res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashPassword, meetings: [] });
    return res.status(httpStatus.CREATED).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
    }

    if (err.name === "ValidationError") {
      return res.status(httpStatus.BAD_REQUEST).json({ message: err.message });
    }

=======
    let d = {
      name: 'Rahul11',
      username: 'Rahul@9003',
      password: 'Rahul@9001',
      token: 'onet his ',
    }
    const existUser = await User.find({ username: d.username });
    console.log(existUser.length);

    if (existUser.length) {
      return res.status(200).json({ message: "user already exist" });
    }

    const hashPassword = await bcrypt.hash(d.password, 10);
    d.password = hashPassword;
    const user = new User(d);
    const t = await user.save();
    console.log(t);
    return res.status(httpStatus.CREATED).json({ message: "user created successfully " });
  } catch (err) {
    console.error(err);
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }

}
// logInUser

const logInUser = async (req, res) => {
<<<<<<< HEAD
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Username and password are required" });
    }

    const existUser = await User.findOne({ username });
    if (!existUser) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" });
    }

    const isExist = await bcrypt.compare(password, existUser.password);
    if (!isExist) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: existUser._id.toString(), username: existUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("auth_token", token, cookieOptions);
    return res.status(200).json({ message: "Login Successfully", username: existUser.username });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
=======
  let d = {
    username: 'Rahul@9003',
    password: 'Rahul@9001',
  }
  console.log(d);
  const existUser = await User.findOne({ username: d.username });
  console.log(existUser);
  if (!existUser) {
    return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" });
  }
  
 let isExist=await (bcrypt.compare(d.password, existUser.password));
  if (isExist) {
    try {
      let token = crypto.randomBytes(20).toString('hex');
      existUser.token = token;
      console.log(token);
      await existUser.save();
      res.status(200).json({ message: "Login Successfully" });
    }
    catch (error) {
      console.log(error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }


  else {
    res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid username or password" });
  }



>>>>>>> f66c690a54900e11880652f86544e383c21efd86
}
//




<<<<<<< HEAD
const logOutUser = (req, res) => {
  res.clearCookie("auth_token", cookieOptions);
  return res.json({ message: "Logged out successfully" });
}

export { getUsers, getCurrentUser, joinMeeting, getMeetings, getChatHistory, clearChatHistory, deleteChatMessage, signUpUser, logInUser, logOutUser };
=======
export { getUsers, signUpUser, logInUser };
>>>>>>> f66c690a54900e11880652f86544e383c21efd86
