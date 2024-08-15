import { RootQuerySelector, UpdateQuery } from "mongoose";
import CustomerSchema, { Customer } from "../models/userModel";

const viewUser = async () => {
  return await CustomerSchema.find();
};

const viewUserById = async (query: string) => {
  return await CustomerSchema.findById(query);
};

const deleteUser = async (query: string) => {
  return await CustomerSchema.findByIdAndDelete(query);
};

const updateUser = async (id: string, query: UpdateQuery<Customer>) => {
  return await CustomerSchema.findByIdAndUpdate(id, query, { new: true });
};

const findUser = async (query: RootQuerySelector<Customer>) => {
  return await CustomerSchema.findOne(query);
};

const registerUser = async (query: RootQuerySelector<Customer>) => {
  return await CustomerSchema.create(query);
};

const findLocationByIdUser = async (query: string) => {
  return await CustomerSchema.findById(query);
};

const updateLoc = async (
  id: string,
  update: UpdateQuery<Customer>
): Promise<Customer | null> => {
  return await CustomerSchema.findOneAndUpdate({ _id: id }, update, {
    new: true
  });
};

export const userService = {
  viewUser,
  viewUserById,
  deleteUser,
  updateUser,
  findUser,
  registerUser,
  findLocationByIdUser,
  updateLoc
};
