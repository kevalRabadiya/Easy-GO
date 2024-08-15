import { NextFunction,Request,Response } from 'express';
import { driverJoiSchema, updateDriverSchema} from '../models/driverModel';
import { addVehicleSchema, updateVehicleSchema} from '../models/vehicleDetails';
import { bookingJoiSchema} from '../models/bookingModel';
import { userJoiSchema } from '../models/userModel';
import {ValidationResult,Schema}from 'joi';

interface validateDataInput{
  property1:string,
  property2:number
}

// joi schema
const schemas:Record<string,Schema> = {
  driver: driverJoiSchema,
  vehicle: addVehicleSchema,
  booking:bookingJoiSchema,
  user: userJoiSchema,
}
const validateData = (model:string,data:validateDataInput):ValidationResult=>schemas[model].validate(data)
export const validateRequest = (req: Request, res: Response, next: NextFunction) => { 
    const {error} = validateData(req.originalUrl.split('/').at(3)!,req.body)
    if (error) {
    return res.status(404).json({success:false,message:"joi schema validation error"+error.details[0].message})
    } 
    next();
};

// update joi schema
const updateSchemas:Record<string,Schema> = {
  driver: updateDriverSchema,
  vehicle: updateVehicleSchema,
}
const updateValidateData = (model:string,data:validateDataInput):ValidationResult=>updateSchemas[model].validate(data)
export const updateValidateRequest = (req:Request, res:Response, next:NextFunction) => {
    const {error} = updateValidateData(req.originalUrl.split('/').at(3)!,req.body)
    if (error) {
    return res.status(404).json({success:false,message:"Update joi schema validation error"+error.details[0].message})
    }
    next();
};
