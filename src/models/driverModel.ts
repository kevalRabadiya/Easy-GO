import mongoose, { Document } from "mongoose";
import Joi from "joi";

export interface ImageObject {
  name: string;
  imageUrl: string;
}
export interface driver extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  available: boolean;
  role: string;
  token: string;
  isVerified: boolean;
  images: ImageObject[];
  location: {
    type: string;
    coordinates: [number, number];
  };
  digit: number;
}

const driverSchema = new mongoose.Schema<driver>({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  phoneNumber: {
    type: String,
    unique: true
  },
  role: {
    type: String,
    enum: ["admin", "driver", "user"],
    default: "driver"
  },
  available: {
    type: Boolean,
    default: true
  },
  token: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  location: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: false
    }
  },
  images: [
    {
      name: { type: String, required: true },
      imageUrl: { type: String, required: true }
    }
  ],
  digit: {
    type: Number
  }
});

const phonePattern = /^(0|91)?[6-9][0-9]{9}$/;

export const driverJoiSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(10).max(10).regex(phonePattern).required(),
  role: Joi.string().default("driver")
});

export const updateDriverSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  role: Joi.string(),
  available: Joi.string(),
  isVerified: Joi.string(),
  location: Joi.object(),
});

driverSchema.index({ location: "2dsphere" });

export default mongoose.model<driver>("driver", driverSchema);
