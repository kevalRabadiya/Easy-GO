import mongoose, { Document } from "mongoose";

export interface Payment extends Document {
  customer: mongoose.Schema.Types.ObjectId;
  booking: mongoose.Schema.Types.ObjectId;
  fare: number;
  paymentMethod: "card" | "cash" | "wallet";
  status: "pending" | "completed" | "failed";
}

const paymentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },
    fare: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cash", "wallet"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model<Payment>("Payment", paymentSchema);
