import dotenv from "dotenv";
dotenv.config();

interface JWTConfig {
  SECRET: string;
  EXPIRES: string;
}
interface DBDATA {
  DB_URL: string;
}
interface TwilloConfig {
  ACCOUNT_SID: string;
  AUTH_TOKEN: string;
  SERVICE_SID: string;
}

const PORT = process.env.PORT;

const JWT: JWTConfig = {
  SECRET: process.env.JWT_SECRET!,
  EXPIRES: process.env.EXPIRES!
};

const DB_DATA: DBDATA = {
  DB_URL: process.env.DB_URL!
};

const TWILIO: TwilloConfig = {
  ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID!,
  AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN!,
  SERVICE_SID: process.env.TWILIO_SERVICE_SID!
};

const DISTANCE = {
  DISTANCE_MATRIX: process.env.DISTANCE_MATRIX_KEY!
};

const MAIL = {
  HOST: process.env.MAIL_HOST,
  USER: process.env.MAIL_USER,
  PASS: process.env.MAIL_PASS
};

const AWS_S3 = {
  NAME: process.env.AWS_BUCKET_NAME!,
  API_KEY: process.env.AWS_ACCESS_KEY_ID!,
  SECRET: process.env.AWS_ACCESS_KEY_SECRET!,
  REGION: process.env.AWS_REGION!
};

const STRIPE = {
  PUBLISH: process.env.STRIPE_API_KEY!,
  SECRECT: process.env.STRIPE_SECRECT!
};

export { PORT, JWT, DB_DATA, TWILIO, DISTANCE, MAIL, AWS_S3, STRIPE };
