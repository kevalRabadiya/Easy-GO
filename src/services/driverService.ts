import { RootQuerySelector, UpdateQuery } from "mongoose";
import driverSchema, { driver } from "../models/driverModel";
import { vehicleService } from "../services/vehicleService";

const viewDriver = async () => {
  return await driverSchema.find();
};

const viewDriverById = async (driverId: string) => {
  const driverData = await driverSchema.findById(driverId);
  const vehiclesData = await vehicleService.findVehicle({ driverId });
  return { driver: driverData, vehicles: vehiclesData };
};

const deleteDriver = async (query: string) => {
  return await driverSchema.findByIdAndDelete(query);
};

const updateDriver = async (id: string, query: UpdateQuery<driver>) => {
  return await driverSchema.findByIdAndUpdate(id, query, { new: true });
};

const findDriver = async (query: RootQuerySelector<driver>) => {
  return await driverSchema.findOne(query);
};

const registerDriver = async (query: RootQuerySelector<driver>) => {
  return await driverSchema.create(query);
};

const registerDriverTemp = async (query: RootQuerySelector<driver>) => {
  return await driverSchema.create(query);
};

const findPhoneNumber = async (query: RootQuerySelector<driver>) => {
  return await driverSchema.findOne(query);
};

const removeTempDriver = async (query: string) => {
  return await driverSchema.findByIdAndDelete(query);
};

const availableDrivers = async () => {
  return await driverSchema
    .find({ available: true })
    .select("name")
    .select("phoneNumber")
    .select("location");
};

const updateBookingOTP = async (id: string) => {
  const digit = Math.floor(1000 + Math.random() * 9000);
  const updatedDriver = await driverSchema.findByIdAndUpdate(
    id,
    { digit },
    { new: true }
  );
  if (!updatedDriver) {
    throw new Error("Driver not found");
  }
  return updatedDriver;
};

const verifyBookingOTP = async (id: string, otp: string) => {
  const driver = await driverSchema.findById(id);
  if (!driver) {
    throw new Error("Driver not found");
  }
  return driver.digit === parseInt(otp, 10);
};

export const driverService = {
  viewDriver,
  viewDriverById,
  deleteDriver,
  updateDriver,
  findDriver,
  registerDriver,
  registerDriverTemp,
  findPhoneNumber,
  removeTempDriver,
  availableDrivers,
  updateBookingOTP,
  verifyBookingOTP
};
