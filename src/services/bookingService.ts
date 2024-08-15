import { QueryOptions, RootQuerySelector, UpdateQuery } from "mongoose";
import BookingSchema, { Booking } from "../models/bookingModel";

const viewBookingAll = async () => {
  return await BookingSchema.find().populate('customer');
};

const viewBooking = async (id: string) => {
  return await BookingSchema.findById(id);
};

const viewBookingFilter = async (query: RootQuerySelector<Booking>) => {
  return await BookingSchema.find(query).sort({ createdAt: -1 });
};

const createBooking = async (id: string) => {
  return await BookingSchema.create(id);
};

const updateBooking = async (
  id: string,
  query: UpdateQuery<Booking>,
  option: QueryOptions<Booking>
) => {
  return await BookingSchema.findByIdAndUpdate(id, query, option);
};

const deleteBooking = async (id: string) => {
  return await BookingSchema.findByIdAndDelete(id);
};

const getRevenue = async () => {
  const result = await BookingSchema.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$pickupTime" },
          month: { $month: "$pickupTime" }
        },
        totalRevenue: { $sum: "$fare" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);
  return result;
};

const aggregateBookings = async () => {
  const result = await BookingSchema.aggregate([
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          week: { $week: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        totalBookings: { $sum: 1 }
      }
    }
  ]);
  return result;
};

const findUserIDBooking = async (query: { customer: string }) => {
  return await BookingSchema.findOne(query);
};

export const bookingService = {
  createBooking,
  viewBookingAll,
  viewBookingFilter,
  viewBooking,
  updateBooking,
  deleteBooking,
  getRevenue,
  aggregateBookings,
  findUserIDBooking
};
