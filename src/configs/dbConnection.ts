import mongoose from "mongoose";
import { DB_DATA } from "../helper/constants";
import dotenv from "dotenv";
import logger from "../utils/logger";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(DB_DATA.DB_URL);
    logger.info("Connected to MongoDB Atlas");
  } catch (error) {
    logger.error("Error in connecting to MongoDB Atlas:", error);
  }
};

export default connectDB;
