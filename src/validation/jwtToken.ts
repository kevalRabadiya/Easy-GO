import jwt from "jsonwebtoken";
import { JWT } from "../helper/constants";
import { Types } from "mongoose";

const generateAccessToken = (user: {
  _id: Types.ObjectId;
  email: string;
  phoneNumber: string;
  role: string;
}) => {
  const payload = {
    id: user._id,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role
  };
  const options = { expiresIn: JWT.EXPIRES };
  return jwt.sign(payload, JWT.SECRET, options);
};

export default generateAccessToken;
