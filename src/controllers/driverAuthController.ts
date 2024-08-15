import { Request, Response} from "express";
import { driverService } from "../services/driverService";
import { TWILIO } from "../helper/constants";
import twilio from "twilio";
import jwtToken from "../validation/jwtToken";
import logger from "../utils/logger";
const client = twilio(TWILIO.ACCOUNT_SID, TWILIO.AUTH_TOKEN);

const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber, location = null } = req.body;
    const userExist = await driverService.findDriver({ phoneNumber });
    if (userExist) {
      logger.error("Existing driver");
      return res.status(400).json({
        isLogin: false,
        message: "Driver Already exist."
      });
    }
    const response = await driverService.registerDriver({
      name,
      email: email.toLowerCase(),
      phoneNumber,
      role: "driver",
      location
    });
    if (!response) {
      logger.error("Invalid Driver data");
      return res.status(400).json({
        isLogin: false,
        message: "Invalid Data"
      });
    }
    await response?.save();
    logger.info("Driver Registered");
    const token = jwtToken(response);
    response.token = token;
    return res.status(201).json({
      isLogin: true,
      isReg: true,
      message: "Driver Registered and move to home screen",
      driverId: response._id,
      token
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
  const lastDigit = phoneNumber?.substring(6, 10);
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
      message: `OTP successfully sent to mobile Number ending with ${lastDigit}`
    });
  } catch (error) {
    logger.error("Error occured while sending otp ", error);
    return res.status(500).json({
      isLogin: false,
      message: error
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
        const existUser = await driverService.findDriver({ phoneNumber });
        if (!existUser) {
          logger.error("No Driver found");
          return res.status(404).json({
            isLogin: false,
            isReg: false,
            data: phoneNumber,
            message: "Oops!! Sign-Up first move to signup screen"
          });
        } else {
          const token = jwtToken(existUser);
          existUser.token = token;
          logger.info(`DriverID: ${existUser.id} logged in successfully`);
          return res.status(200).json({
            isLogin: true,
            isReg: true,
            token,
            driverId: existUser.id,
            message: "Driver Logged in successfully"
          });
        }
      }
      default:
        logger.error("OTP enetered is invalid");
        return res.status(400).json({
          isLogin: false,
          message: "Invalid OTP. Please try again."
        });
    }
  } catch (error) {
    logger.error("Error occured at Login ", error);
    return res.status(500).json({
      isLogin: false,
      message: error
    });
  }
};

export { signUp, login, verify };

// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------

// import { Request, Response } from "express";
// import { driverService } from "../services/driverService";

// const STATIC_PHONE_NUMBER = "9999999999";
// const STATIC_OTP = "9999";

// const signUp = async (req: Request, res: Response) => {
//   try {
//     const { name, email, phoneNumber } = req.body;
//     if (!name || !email || !phoneNumber) {
//       return res
//         .status(404)
//         .json({ isLogin: false, message: "Enter valid details." });
//     }
//     const userExist = await driverService.findDriver({ phoneNumber });
//     if (userExist) {
//       return res
//         .status(200)
//         .json({ isLogin: false, message: "User Already exist." });
//     }
//     const response = await driverService.registeruserTemp({
//       name,
//       email: email.toLowerCase(),
//       phoneNumber,
//       role: "driver",
//     });
//     if (!response) {
//       return res.status(400).json({
//         isLogin: false,
//         isLogin: false,
//         message: "Invalid Data",
//       });
//     }
//     return res.json({
//       isLogin: true,
//       isLogin: true,
//       data: response,
//       message: "OTP sent isLoginfully",
//     });
//   } catch (error) {
//     return res.json({
//       isLogin: false,
//       message: "Error at signing up " + error,
//     });
//   }
// };

// const verifyOtp = async (req: Request, res: Response) => {
//   const { phoneNumber, otp } = req.body;

//   // Check if the provided phone number and OTP match the static values
//   if (phoneNumber === STATIC_PHONE_NUMBER && otp === STATIC_OTP) {
//     // Perform user registration or any other necessary actions here
//     return res.status(200).json({
//       isLogin: true,
//       message: "OTP isLoginfully verified",
//     });
//   } else {
//     return res.status(500).json({
//       isLogin: false,
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
//       message: "OTP isLoginfully sent",
//     });
//   } else {
//     return res.status(400).json({
//       isLogin: false,
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
//       isLogin: false,
//       message: "Enter Valid details",
//     });
//   }
//   try {
//     if (phoneNumber === STATIC_PHONE_NUMBER && otp === STATIC_OTP)
//       return res.status(200).json({
//         isLogin: true,
//         message: "isLoginfully logged in",
//       });
//   } catch (error) {
//     return res.status(500).json({
//       isLogin: false,
//       isLogin: false,
//       message: error,
//     });
//   }
// };

// export { signUp, verifyOtp, sendLoginOtp, login };
