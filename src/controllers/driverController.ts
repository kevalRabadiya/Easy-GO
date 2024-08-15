import { driverService } from "../services/driverService";
import { vehicleService } from "../services/vehicleService";
import { Request, Response } from "express";
import { AWS_S3 } from "../helper/constants";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { client } from "../configs/awsS3Client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import logger from "../utils/logger";
// import router from "../routes";
// import Jimp from "jimp";

export const getDriver = async (req: Request, res: Response) => {
  try {
    const { id } = req.query as { id: string };
    if (id) {
      const response = await driverService.viewDriverById(id);
      if (!response) {
        logger.error("Invalid ID while get driver.");
        return res.status(404).json({
          success: false,
          message: "Invalid ID",
        });
      }
      logger.info("Get Driver by id is successful.");
      return res.status(200).json({
        success: true,
        message: "Driver found",
        data: response,
      });
    } else {
      const response = await driverService.viewDriver();
      return res.status(200).json({
        success: true,
        message: "List of drivers found",
        data: response,
      });
    }
  } catch (error) {
    logger.error("Error in getDriver.", error);
    return res.status(500).json({
      success: false,
      message: "Error in getDriver",
    });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { model, year, licensePlate, vehicleClass } = req.body;
    const response = await vehicleService.updateVehicleDetails(id, {
      model,
      year,
      licensePlate,
      vehicleClass
    });
    if (!response) {
      logger.error("Invalid ID while updating Vehicle.");
      return res.status(404).json({
        success: false,
        message: "Invalid ID"
      });
    } else {
      logger.info("Updating Vehicle was success.");
      return res.status(200).json({
        success: true,
        data: response,
        message: "vehicle details updated Successfully."
      });
    }
  } catch (error) {
    logger.error("Error in UpdateVehicle." + error);
    return res.status(500).json({
      success: false,
      message: "ERROR in Update Vehicle " + error
    });
  }
};

export const updateDriver = async (req: Request, res: Response) => {
  try {
    const { name, email, isVerified, location } = req.body;
    const response = await driverService.updateDriver(req.params.id, {
      name,
      email,
      isVerified,
      location
    });
    if (!response) {
      logger.error("Invalid ID while updating Driver");
      return res.status(404).json({
        success: false,
        message: "Invalid ID"
      });
    } else {
      logger.info("Updating Driver was success.");
      return res.status(200).json({
        success: true,
        data: response,
        message: "Driver data updated Successfully"
      });
    }
  } catch (error) {
    logger.error("Error in UpdateDriver." + error);
    return res.status(500).json({
      success: false,
      message: "ERROR in Update Driver " + error
    });
  }
};

export const deleteDriver = async (req: Request, res: Response) => {
  try {
    const response = await driverService.deleteDriver(req.params.id);
    if (!response) {
      logger.error("Invalid ID while Deleteing driver.");
      return res.status(400).json({
        success: false,
        message: "Invalid driverID"
      });
    } else {
      logger.info("Deleing Driver was success.");
      return res.status(200).json({
        success: true,
        data: response,
        message: "Driver deleted Successfully"
      });
    }
  } catch (error) {
    logger.error("Error in DeleteDriver." + error);
    return res.status(500).json({
      success: false,
      message: error
    });
  }
};

export const availableDrivers = async (req: Request, res: Response) => {
  try {
    const response = await driverService.availableDrivers();
    if (!response) {
      logger.error("No available driver.");
      return res.status(404).json({
        success: false,
        message: "Not Available Any Driver"
      });
    } else {
      logger.info("Available driver is found.");
      return res.status(200).json({
        success: true,
        data: response,
        message: "all available driver"
      });
    }
  } catch (error) {
    logger.error("Error in availableDriver." + error);
    return res.status(500).json({
      success: false,
      message: error
    });
  }
};

// export const watermark = async (req:Request, res:Response) => {
//     // const { key } = req.query; 
//     try {
//         // const imageBuffer = '';
//           logger.info("image proccesing")
//         // Add watermark
//         const watermarkedBuffer = await addWatermark('https://fotofizz-directus.preview.im/assets/eec653ac-8e03-4190-9bf9-9fdf2b1eff26', 'Bhagysesh radia');
//         // Serve the watermarked image
//         res.writeHead(200, { 'Content-Type': 'image/png' });
//         res.end(watermarkedBuffer, 'binary');
//     } catch (error) {
//         console.error('Error in downloadWithWatermark:', error);
//         res.status(500).json({ success: false, message: `Error downloading image with watermark: ${error}` });
//     }
// };

// async function addWatermark(imageBuffer:any, watermarkText:any) {
//     const image = await Jimp.read(imageBuffer);
//     const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
//     image.print(font, 10, 10, watermarkText);
//     return image.getBufferAsync(Jimp.MIME_PNG);
// }

export const imageUpload = async (req: Request, res: Response) => {
  try {
    const getPresignedUrl = async (client: S3Client) => {
      const fileName =
        Date.now().toString() + (Math.random() * 100000).toFixed(0);
      const fileUrl = `https://${AWS_S3.NAME}.s3.${AWS_S3.REGION}.amazonaws.com/${fileName}`;
      const command = new PutObjectCommand({
        Bucket: AWS_S3.NAME,
        Key: fileName
      });
      const preSignedUrl = await getSignedUrl(client, command);
      return {
        fileUrl,
        preSignedUrl
      };
    };
    const count = req.query.count ?? 1;
    const presignedUrlArray = [];
    for (let index = 0; index < +count; index++) {
      presignedUrlArray.push(getPresignedUrl(client));
    }
    const presignedUrlResult = await Promise.allSettled(presignedUrlArray);
    const uploadUrls = [];
    for (const result of presignedUrlResult) {
      if (result.status === "fulfilled") {
        uploadUrls.push(result.value);
      }
    }
    return res.status(200).json({
      success: true,
      data: uploadUrls,
      message: "preSignedUrl Generated..."
    });
  } catch (error) {
    logger.error("Error in imageUpload." + error);
    return res
      .status(500)
      .json({ success: false, message: "preSigned URL failed:" + error });
  }
};

export const addVehicleAndSaveImage = async (req: Request, res: Response) => {
  try {
    const { model, year, licensePlate, vehicleClass, driverId, imageUrls } =
      req.body;
    const vehicleExist = await vehicleService.findVehicle({ licensePlate });
    if (vehicleExist) {
      logger.error("Vehicle is already registered.");
      return res.status(409).json({
        success: false,
        message: "Already Registered Vehicle"
      });
    }
    // Add the vehicle
    const response = await vehicleService.addVehicle({
      model,
      year,
      licensePlate,
      vehicleClass,
      driverId,
      fare: 0
    });
    await response.save();
    const driver = await driverService.findDriver({ _id: driverId });
    if (!driver) {
      logger.error("Driver not found to add vehicle.");
      return res.status(404).json({
        success: false,
        message: "Driver not found"
      });
    }
    // Add each image URL to the driver's images array
    for (const imageUrl of imageUrls) {
      driver.images.push(imageUrl);
    }
    // Save the updated driver document
    await driver.save();
    return res.status(201).json({
      success: true,
      isReg: true,
      message: "Vehicle added successfully, and image URLs saved"
    });
  } catch (error) {
    logger.error("Error in addImage in DB." + error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while adding vehicle or saving image URLs: " +
        error
    });
  }
};

export const bookingOTP = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    logger.error("Driver id is not given.");
    return res.status(400).json({
      success: false,
      message: "Driver ID is required"
    });
  }
  try {
    const updatedDigit = await driverService.updateBookingOTP(id);
    logger.info("Booking otp is generated.");
    return res.status(200).json({
      success: true,
      randomDigit: updatedDigit.digit
    });
  } catch (error) {
    logger.error("Error in save randomDigit in DB." + error);
    return res.status(500).json({
      success: false,
      message: "Error in generating and saving random digit: " + error
    });
  }
};

export const verifyBookingOTP = async (req: Request, res: Response) => {
  const { id, otp } = req.body;
  if (!id || !otp) {
    logger.error("DriverID or otp is not given.");
    return res.status(400).json({
      success: false,
      message: "Driver ID and OTP are required"
    });
  }
  try {
    const isValid = await driverService.verifyBookingOTP(id, otp);
    if (isValid) {
      logger.info("OTP verification is a success.");
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully"
      });
    } else {
      logger.error("entered invalid OTP.");
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }
  } catch (error) {
    logger.error("Error in verifying OTP: " + error);
    return res.status(500).json({
      success: false,
      message: "Error in verifying OTP: " + error
    });
  }
};
