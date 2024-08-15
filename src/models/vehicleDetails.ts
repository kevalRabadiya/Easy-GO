import mongoose from "mongoose";
import Joi from "joi";

export interface driver {
  _id: mongoose.Schema.Types.ObjectId;
}
export interface vehicle {
  model: string;
  year: number;
  licensePlate: string;
  vehicleClass: "Bike" | "Rickshaw" | "Mini" | "Premium" | "XL";
  driverId: driver | string;
}

const vehicleDetails = new mongoose.Schema<vehicle>({
  driverId: {
    type: mongoose.Types.ObjectId,
    ref: "Driver"
  },
  model: {
    type: String
  },
  year: {
    type: Number
  },
  licensePlate: {
    type: String
  },
  vehicleClass: {
    type: String,
    enum: ["Bike", "Rickshaw", "Mini", "Premium", "XL"]
  }
});

export const addVehicleSchema = Joi.object({
  model: Joi.string().required(),
  year: Joi.string().min(4).max(4).required(),
  licensePlate: Joi.string().required(),
  vehicleClass: Joi.string()
    .valid("Bike", "Rickshaw", "Mini", "Premium", "XL")
    .required(),
  driverId: Joi.string().required()
});

export const updateVehicleSchema = Joi.object({
  model: Joi.string(),
  year: Joi.string().min(4).max(4),
  licensePlate: Joi.string(),
  vehicleClass: Joi.string()
    .valid("Bike", "Rickshaw", "Mini", "Premium", "XL"),
});

export default mongoose.model<vehicle>("Vehicle", vehicleDetails);
