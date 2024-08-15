import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { AWS_S3 } from "../helper/constants";

const config: S3ClientConfig = {
  credentials: {
    accessKeyId: AWS_S3.API_KEY ?? "",
    secretAccessKey: AWS_S3.SECRET ?? ""
  },
  region: AWS_S3.REGION
};

export const client = new S3Client(config);
