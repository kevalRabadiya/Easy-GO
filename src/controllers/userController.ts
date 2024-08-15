import { Request, Response } from "express";
import { userService } from "../services/userService";
import logger from "../utils/logger";

const viewUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.query as { id: string };
    if (id) {
      const response = await userService.viewUserById(id);
      if (!response) {
        return res.status(404).json({
          success: false,
          message: "No user found"
        });
      }
      return res.status(200).json({
        success: true,
        message: "User found",
        data: response
      });
    } else {
      const response = await userService.viewUser();
      return res.status(200).json({
        success: true,
        message: "List of user found",
        data: response
      });
    }
  } catch (error) {
    logger.error("Error occured while retrieving customer ", error);
    return res.status(500).json({
      success: false,
      message: "Error occured while retrieving customer"
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.query as { id: string };
    const { name, email } = req.body;
    const response = await userService.updateUser(id, {
      name,
      email
    });
    if (!response) {
      logger.error("Invalid ID while updating Customer");
      return res.status(404).json({
        success: false,
        message: "Invalid ID"
      });
    } else {
      logger.info("Updating Customer was success.");
      return res.status(200).json({
        success: true,
        data: response
      });
    }
  } catch (error) {
    logger.error("Error Occured while updating Customer ", error);
    return res.status(500).json({
      success: false
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.query as { id: string };
    const response = await userService.deleteUser(id);
    if (!response) {
      logger.error("Invalid ID while deleting customer");
      return res.status(404).json({
        success: false,
        message: "Invalid ID"
      });
    }
    logger.info("Deleting a customer based on ID was success");
    return res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    logger.error("Error occured while deleting a custoomer ", error);
    return res.status(500).json({
      success: false,
      message: "ERROR in DeleteCustomer " + error
    });
  }
};

export { viewUser, updateUser, deleteUser };
