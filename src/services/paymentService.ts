import { UpdateQuery, QueryOptions } from "mongoose";
import paymentSchema, { Payment } from "../models/paymentModel";

const createPayment = async (id: string) => {
  return await paymentSchema.create(id);
};

const allPayment = async () => {
  return await paymentSchema.find().populate('customer').populate('booking')
};

const updateStatus = async (
  id: string,
  query: UpdateQuery<Payment>,
  option: QueryOptions<Payment>
) => {
  return await paymentSchema.findByIdAndUpdate(id, query, option);
};

export const paymentService ={
  createPayment,allPayment,updateStatus
}