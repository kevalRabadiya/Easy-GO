import { it, describe, expect } from "@jest/globals";
import app from "../../src/app";
import supertest from "supertest";
import { setupDB } from "../../src/configs/memoryServer";

describe("validateRequest middleware", () => {
  setupDB();
  it("should return 404 if joischema validation error occurs", async () => {
    const invalidRequestBody = {
      pickupLocation: "Pa",
      dropoffLocation: "Sola, Ahmedabad, Gujarat 380059, India",
      vehicleClass: "Bike",
      fare: 140
    };

    const { statusCode, body, request } = await supertest(app)
      .post(`/api/v1/booking/`)
      .send(invalidRequestBody);
    expect(request.url.split("/").at(5)).toBe("booking");
    expect(statusCode).toBe(404);
    expect(body.success).toBe(false);
    expect(body.message).toContain("joischema validation error");
  });
});
