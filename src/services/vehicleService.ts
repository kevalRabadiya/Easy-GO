import { RootQuerySelector, UpdateQuery } from "mongoose";
import vehicleDetails, { vehicle } from "../models/vehicleDetails";

const findVehicle = async (query: RootQuerySelector<vehicle>) => {
  return await vehicleDetails.findOne(query);
};

const addVehicle = async (query: RootQuerySelector<vehicle>) => {
  return await vehicleDetails.create(query);
};

const updateVehicleDetails = async (
  id: string,
  query: UpdateQuery<vehicle>
) => {
  return await vehicleDetails.findByIdAndUpdate(id, query);
};

export const vehicleService = { findVehicle, addVehicle, updateVehicleDetails };
