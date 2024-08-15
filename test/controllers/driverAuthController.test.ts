import app from "../../src/app";
import { it, describe, expect } from "@jest/globals";
import request from "supertest";
import { setupDB } from "../../src/configs/memoryServer";

describe("Driver Registration", () => {
  setupDB();
  it("should register a new driver with valid data", async () => {
    const response = await request(app).post("/api/v1/driver/register").send({
      name: "John Doe",
      email: "johndoe@example.com",
      phoneNumber: "9999999999"
    });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("OTP sent successfully");
  });

  it("should return an error for invalid data", async () => {
    const response = await request(app).post("/api/v1/driver/register").send({
      email: "invalid@example.com",
      phoneNumber: "1234567890"
    });
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Enter valid details.");
  });
});

describe("OTP Verification", () => {
  setupDB();

  it("should verify OTP successfully with correct phone number and OTP", async () => {
    const response = await request(app).post("/api/v1/driver/verify-otp").send({
      phoneNumber: "9999999999",
      otp: "9999"
    });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("OTP successfully verified");
  });

  it("should return an error for incorrect phone number or OTP", async () => {
    const response = await request(app).post("/api/v1/driver/verify-otp").send({
      phoneNumber: "1234567890",
      otp: "0000"
    });
    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid phone number or OTP");
  });
});

describe("Login OTP Sending", () => {
  setupDB();

  it("should send OTP successfully for valid phone number", async () => {
    const response = await request(app)
      .post("/api/v1/driver/send-login-otp")
      .send({
        phoneNumber: "9999999999"
      });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("OTP successfully sent");
  });

  it("should return an error for invalid phone number", async () => {
    const response = await request(app)
      .post("/api/v1/driver/send-login-otp")
      .send({
        phoneNumber: "1234567890"
      });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid phone number");
  });
});

describe("Login", () => {
  setupDB();

  it("should successfully log in with correct phone number and OTP", async () => {
    const response = await request(app).post("/api/v1/driver/login").send({
      phoneNumber: "9999999999",
      otp: "9999"
    });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("successfully logged in");
  });

  it("should return an error for missing phone number or OTP", async () => {
    const response = await request(app).post("/api/v1/driver/login").send({
      // Missing phone number and OTP
    });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Enter Valid details");
  });
});
