import { Request, Response } from "express";
import { userService } from "../services/userService";
import { TWILIO } from "../helper/constants";
import twilio from "twilio";
import jwtToken from "../validation/jwtToken";
import radiusCalc from "../utils/radiusCalc";
import { driverService } from "../services/driverService";
import logger from "../utils/logger";
import { sendRequestToDriver } from "../utils/sendRequest";
import { bookingService } from "../services/bookingService";
const client = twilio(TWILIO.ACCOUNT_SID, TWILIO.AUTH_TOKEN);

const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const userExist = await userService.findUser({ phoneNumber });
    if (userExist) {
      logger.error("Existing User");
      return res.status(400).json({
        isLogin: false,
        message: "User Already exist."
      });
    }
    const response = await userService.registerUser({
      name,
      email: email.toLowerCase(),
      phoneNumber,
      role: "user"
    });
    if (!response) {
      logger.error("Invalid User data");
      return res.status(400).json({
        isLogin: false,
        message: "Invalid Data"
      });
    }
    await response?.save();
    logger.info("user Registered");
    const token = jwtToken(response);
    response.token = token;
    return res.status(201).json({
      isLogin: true,
      token,
      userId: response.id,
      message: "user Registered and move to home screen"
    });
  } catch (error) {
    logger.error("Error occured at signing up! ", error);
    return res.status(500).json({
      isLogin: false,
      message: error
    });
  }
};

const login = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;
  const lastDigit = phoneNumber.substring(6, 10);
  if (!phoneNumber) {
    logger.error("Invalid Phone number");
    return res.status(404).json({
      isLogin: false,
      message: "Enter PhoneNumber"
    });
  }
  try {
    await client.verify.v2.services(TWILIO.SERVICE_SID).verifications.create({
      to: `+91${phoneNumber}`,
      channel: "sms"
    });
    logger.info(`Otp successfully sent to xxxxxx${lastDigit}`);
    return res.status(200).json({
      isLogin: true,
      message: `OTP successfully sent to mobile Number`
    });
  } catch (error) {
    logger.error("Error occured while sending otp ", error);
    return res.status(500).json({
      isLogin: false,
      message: `Error in Login` + error
    });
  }
};

const verify = async (req: Request, res: Response) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    logger.error("Enter valid phone number and otp");
    return res.status(404).json({
      isLogin: false,
      message: "Please Enter valid phone number and otp"
    });
  }
  try {
    const response = await client.verify.v2
      .services(TWILIO.SERVICE_SID)
      .verificationChecks.create({
        to: `+91${phoneNumber}`,
        code: otp
      });
    switch (response.status) {
      case "approved": {
        const existUser = await userService.findUser({ phoneNumber });
        if (!existUser) {
          logger.error("No user found");
          return res.status(404).json({
            isLogin: false,
            message: "Oops!! Sign-Up first move to signup screen"
          });
        } else {
          const token = jwtToken(existUser);
          existUser.token = token;
          logger.info(`UserID: ${existUser.id} logged in successfully`);
          return res.status(200).json({
            isLogin: true,
            token,
            userId: existUser.id,
            message: "User Logged in successfully"
          });
        }
      }
      default:
        logger.error("OTP entered is invalid");
        return res.status(400).json({
          isLogin: false,
          message: "Invalid OTP. Please try again."
        });
    }
  } catch (error) {
    logger.error("Error occured at Login ", error);
    return res.status(500).json({
      isLogin: false,
      message: "Error in verify OTP" + error
    });
  }
};

const requestDrive = async (req: Request, res: Response): Promise<Response> => {
  try {
    const drivers = [];
    const userId = req.user?.id;
    const bookingDetails = await bookingService.findUserIDBooking({
      customer: userId
    });
    const userDetails = await userService.viewUserById(userId);
    if (!bookingDetails) {
      logger.error("Booking details not found! check your token");
      return res.status(404).json({
        isLogin: false,
        message: "Booking location not found."
      });
    }
    const latU = bookingDetails.origin.coordinates[0];
    const longU = bookingDetails.origin.coordinates[1];
    if (!latU && !longU) {
      logger.error("Lat & Long undefined");
      return res.status(404).json({
        isLogin: false,
        message: "Lat & Long undefined"
      });
    }

    const availableDrivers = await driverService.availableDrivers();
    if (!availableDrivers) {
      logger.error("No available drivers found!");
      return res.status(404).json({
        isLogin: false,
        message: "No available drivers found."
      });
    }
    let driverFoundWithin2Km = false;
    for (const driver of availableDrivers) {
      const driverCoordinates = driver.location?.coordinates;
      if (!driverCoordinates || driverCoordinates.length < 2) {
        continue;
      }
      const [latD, longD] = driverCoordinates;
      const Radius = radiusCalc(latU, longU, latD, longD);
      if (Radius < 2) {
        const name = userDetails?.name;
        const location = bookingDetails?.origin;
        if (!name || !location) {
          return res.json({
            success: false,
            message: "Unable to fetch user details"
          });
        }
        const coords = location.coordinates;
        await sendRequestToDriver(driver, { name, coords });
        drivers.push(driver);
        driverFoundWithin2Km = true;
      }
    }
    if (driverFoundWithin2Km) {
      logger.info("Request sent to drivers within 2 K.M.");
      return res.status(200).json({
        isLogin: true,
        userDetail: bookingDetails,
        driverDetails: drivers,
        message: "Requests sent to nearby drivers within 2 km radius."
      });
    } else {
      logger.info("No driver found within 2km Radius");
      return res.json({
        isLogin: false,
        message: "No available drivers found within 2 km radius."
      });
    }
  } catch (error) {
    logger.error("An error occurred while processing the request. ", error);
    return res.status(500).json({
      isLogin: false,
      message: "An error occurred while processing the request."
    });
  }
};

export { signUp, login, verify, requestDrive };

// import { Request, Response } from "express";
// import { userService } from "../services/userService";

// // Static phone number and OTP
// const STATIC_PHONE_NUMBER = "9999999999";
// const STATIC_OTP = "9999";

// const signUp = async (req: Request, res: Response) => {
//   try {
//     const { name, email, phoneNumber, role, location } = req.body;
//   if (!name || !email || !phoneNumber || !role || !location) {
//     return res
//       .status(200)
//       .json({ isLogin: false, message: "Enter valid details." });
//   }
//   const userExist = await userService.findCustomer({ phoneNumber });
//   if (userExist) {
//     return res
//       .status(200)
//       .json({ isLogin: false, message: "User Already exist." });
//   }
//   if (role !== "admin") {
//     const response = await userService.registeruserTemp({
//       name,
//       email: email.toLowerCase(),
//       phoneNumber,
//       role,
//       location,
//     });
//     if (!response) {
//       return res.status(400).json({
//         isLogin: false,
//         message: "Invalid Data",
//       });
//     }
//     return res.json({
//       isLogin: true,
//       data: response,
//       message: "OTP sent successfully"
//     })
//   }
//   } catch (error) {
//     return res.json({
//       isLogin: false,
//       message:"Error at signing up "+ error
//     })
//   }
// };
// const verifyOtp = async (req: Request, res: Response) => {
//   const { phoneNumber, otp } = req.body;

//   // Check if the provided phone number and OTP match the static values
//   if (phoneNumber === STATIC_PHONE_NUMBER && otp === STATIC_OTP) {
//     // Perform user registration or any other necessary actions here
//     return res.status(200).json({
//       isLogin: true,
//       message: "OTP successfully verified",
//     });
//   } else {
//     return res.status(400).json({
//       isLogin: false,
//       message: "Invalid phone number or OTP",
//     });
//   }
// };

// const sendLoginOtp = async (req: Request, res: Response) => {
//   const { phoneNumber } = req.body;

//   // Check if the provided phone number matches the static value
//   if (phoneNumber === STATIC_PHONE_NUMBER) {
//     // Simulate OTP sent
//     return res.status(200).json({
//       isLogin: true,
//       message: "OTP successfully sent",
//     });
//   } else {
//     return res.status(400).json({
//       isLogin: false,
//       message: "Invalid phone number",
//     });
//   }
// };

// const login = async (req: Request, res: Response) => {
//   const { phoneNumber, otp } = req.body;
//   if (!phoneNumber || !otp) {
//     return res.json({
//       isLogin: false,
//       message: "Enter Valid details",
//     });
//   }
//   try {
//     if(phoneNumber === STATIC_PHONE_NUMBER && otp === STATIC_OTP)
//     return res.json({
//       isLogin: true,
//       message: "successfully logged in",
//     });
//   } catch (error) {
//     return res.json({
//       isLogin: false,
//       message: error,
//     });
//   }
// };

// export { signUp, verifyOtp, sendLoginOtp, login };
