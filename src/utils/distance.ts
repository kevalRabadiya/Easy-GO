import { Request, Response } from "express";
import { DISTANCE } from "../helper/constants";
import dotenv from "dotenv";
dotenv.config();

const calcDistance = async (req: Request, res: Response) => {
  try {
    const apiKey = DISTANCE.DISTANCE_MATRIX;
    const { origins, destinations } = req.body;
    const response = await fetch(
      `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&mode=driving&departure_time=now&key=${apiKey}`
    );

    const data = await response.json();
    const traveledDistance = data.rows[0].elements[0].distance.value;
    const totalFare = Math.ceil(traveledDistance * 0.022);
    console.log(totalFare);
    return res.status(200).json({
      sucess: true,
      data: data
    });
  } catch (error) {
    return res.status(500).json({
      sucess: true,
      data: error
    });
  }
};

export default calcDistance;
