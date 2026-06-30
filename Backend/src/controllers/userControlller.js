import { User } from "../models/userSchema.js";
import httpStatus from "http-status";
import bcrypt, { hash } from 'bcrypt';
import crypto from "crypto";

const getUsers = async (req, res) => {
  const data = await User.find({});
  res.json(data);
  console.log(data);
}
// signupUser
const signUpUser = async (req, res) => {
  try {
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
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }

}
// logInUser

const logInUser = async (req, res) => {
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



}
//




export { getUsers, signUpUser, logInUser };