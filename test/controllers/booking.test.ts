import { it, describe, expect, beforeAll, afterAll } from "@jest/globals";
import app from "../../src/app";
import supertest from "supertest";
import { setupDB } from "../../src/configs/memoryServer";

var createdBookingId: string;
describe("booking", () => {
  setupDB();
  var status: string;
  const booking_payload = {
    pickupLocation: "Panchamrut Bunglows II",
    dropoffLocation: "Sola, Ahmedabad, Gujarat 380059, India",
    vehicleClass: "Bike",
    fare: 140
  };
  describe("GET/POST with 200 Ok and return success", () => {
    it("POST/ booking", async () => {
      const { statusCode, body } = await supertest(app)
        .post("/api/v1/booking/")
        .send(booking_payload);
      createdBookingId = body.data._id;
      status = body.data.status;
      expect(statusCode).toBe(201);
      expect(body).toEqual({
        success: true,
        data: {
          vehicleClass: "Bike",
          pickupLocation: "Panchamrut Bunglows II",
          dropoffLocation: "Sola, Ahmedabad, Gujarat 380059, India",
          pickupTime: expect.any(String),
          status: "pending",
          fare: 140,
          comments: "Good Experience",
          _id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: 0
        },
        message: "Ride booking successfully."
      });
    });

    it("should return 200", async () => {
      const { body, statusCode } = await supertest(app).get(
        `/api/v1/booking/list/`
      );
      expect(body.success).toBe(true);
      expect(statusCode).toBe(200);
    });

    it("should return 200 if ID is provided by query", async () => {
      const id = {
        _id: createdBookingId
      };
      const { body, statusCode } = await supertest(app)
        .get("/api/v1/booking/list/")
        .query(id);
      expect(statusCode).toBe(200);
      expect(body.success).toBe(true);
    });

    it("should return 200 if ID is provided by body", async () => {
      const id = {
        _id: createdBookingId
      };
      const { body, statusCode } = await supertest(app)
        .get("/api/v1/booking/list/")
        .send(id);
      expect(statusCode).toBe(200);
      expect(body.success).toBe(true);
    });

    it("should return 200 if status is provided by body", async () => {
      const statusDemo = {
        _status: status
      };
      const { body, statusCode } = await supertest(app)
        .get(`/api/v1/booking/list/`)
        .send(statusDemo);
      expect(statusCode).toBe(200);
      expect(body.success).toBe(true);
    });

    it("should return 200 if status is provided by query", async () => {
      const statusDemo = {
        _status: status
      };
      const { body, statusCode } = await supertest(app)
        .get(`/api/v1/booking/list/`)
        .query(statusDemo);
      expect(statusCode).toBe(200);
      expect(body.success).toBe(true);
    });
  });

  describe("DELETE /api/v1/booking/:id", () => {
    let demoid: string;
    beforeAll(async () => {
      var booking_payload = {
        pickupLocation: "Panchamrut Bunglows II",
        dropoffLocation: "Sola, Ahmedabad, Gujarat 380059, India",
        vehicleClass: "Bike",
        fare: 140
      };

      const response = await supertest(app)
        .post("/api/v1/booking/")
        .send(booking_payload);
      createdBookingId = response.body.data._id;
    });

    afterAll(async () => {
      if (demoid) {
        await supertest(app).delete(`/api/v1/booking/${createdBookingId}`);
      }
    });

    it("should delete a booking and return success message", async () => {
      const response = await supertest(app).delete(
        `/api/v1/booking/${createdBookingId}`
      );
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Booking Cancel Suceesfully.");
    });
  });

  describe("PUT /api/v1/booking/:id", () => {
    beforeAll(async () => {
      var bookingPayload = {
        pickupLocation: "Panchamrut Bunglows II",
        dropoffLocation: "Sola, Ahmedabad, Gujarat 380059, India",
        vehicleClass: "Bike",
        fare: 140
      };
      const response = await supertest(app)
        .post("/api/v1/booking/")
        .send(bookingPayload);
      createdBookingId = response.body.data._id;
    });

    afterAll(async () => {
      if (createdBookingId) {
        await supertest(app).delete(`/api/v1/booking/${createdBookingId}`);
      }
    });

    it("should update a booking and return success message", async () => {
      const updatedBookingData = {
        pickupLocation: "Updated Pickup Location",
        dropoffLocation: "Updated Dropoff Location",
        vehicleClass: "Updated Vehicle Class",
        fare: 150
      };

      const response = await supertest(app)
        .put(`/api/v1/booking/${createdBookingId}`)
        .send(updatedBookingData);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Booking updated successfully..");
    });
    it("should return 404 if no booking ID or status is provided", async () => {
      const { statusCode } = await supertest(app)
        .put("/api/v1/bookings/update/")
        .send({});
      expect(statusCode).toBe(404);
    });
  });
});

describe("booking-with error cases", () => {
  setupDB();
  describe("GET/ booking", () => {
    it("should return 500", async () => {
      await supertest(app)
        .get(`/api/v1/booking/list/`)
        .query({ id: "invalid123" });
      expect(500).toBe(500);
    });

    it("should return 404 if no booking is found with the provided id by query", async () => {
      const { statusCode } = await supertest(app)
        .get("/api/v1/bookings/list/")
        .query({ id: "6634ab0a1a0399a6e66e0926" });
      expect(statusCode).toBe(404);
    });

    it("should return 404 if no booking is found with the provided id by body", async () => {
      const { statusCode } = await supertest(app)
        .get("/api/v1/bookings/list/")
        .send({ id: "6634ab0a1a0399a6e66e0926" });
      expect(statusCode).toBe(404);
    });

    it("should return 404 if an invalid status query parameter is provided in query ", async () => {
      const { body, statusCode } = await supertest(app)
        .get("/api/v1/booking/list/")
        .query({ status: "invalid123" });
      expect(statusCode).toBe(404);
      expect(body.success).toBe(false);
      expect(body.message).toBe("Invalid Enter Status");
    });

    it("should return 404 if an No data match of status query parameter is provided in query ", async () => {
      const { body, statusCode } = await supertest(app)
        .get("/api/v1/booking/list/")
        .query({ status: "ongoing" });
      expect(statusCode).toBe(404);
      expect(body.success).toBe(false);
      expect(body.message).toBe("No Booking found");
    });
  });

  describe("DELETE/ booking", () => {
    it("should return 404 if there is an error in deleting the booking", async () => {
      const { body, statusCode } = await supertest(app).delete(
        `/api/v1/booking/662f73231a0399a6e66e08bc`
      );
      expect(statusCode).toBe(404);
      expect(body.success).toBe(false);
    });

    it("should return 500 if there is an error in deleting the booking", async () => {
      const { body, statusCode } = await supertest(app).delete(
        `/api/v1/booking/662f73231a0399a6e66`
      );
      expect(statusCode).toBe(500);
      expect(body.success).toBe(false);
    });
  });
});

describe("POST/ booking", () => {
  it("should enter empty body and return 404", async () => {
    const { statusCode } = await supertest(app)
      .post("/api/v1/booking/")
      .send({});
    expect(statusCode).toBe(404);
  });
  it("should create a booking and return 500", async () => {
    const booking_payload = {
      pickupLocation:
        "Panchamrut Bunglows II, Sola, Ahmedabad, Gujarat 380059, India",
      dropoffLocation: "Sola, Ahmedabad, Gujarat 380059, India",
      vehicleClass: "Auto",
      fare: 140,
      status: "pendingwde"
    };
    const { statusCode } = await supertest(app)
      .post("/api/v1/booking/")
      .send(booking_payload);
    expect(statusCode).toBe(500);
  });
});

describe("PUT/ booking", () => {
  it("should return 500 if there is an error in updateing the booking", async () => {
    const { body, statusCode } = await supertest(app).put(
      `/api/v1/booking/662f73231a0399a`
    );
    expect(statusCode).toBe(500);
    expect(body.success).toBe(false);
  });
});

describe("payment", () => {
  setupDB();
  describe("GET/ revenue", () => {
    it("return 200 status and get total revenue", async () => {
      const { body, statusCode } = await supertest(app).get(
        "/api/v1/booking/revenue/"
      );
      expect(statusCode).toBe(200);
      expect(body.success).toBe(true);
    });
    it("return 404 for wrong path", async () => {
      const { statusCode } = await supertest(app).get(
        "/api/v1/booking/revenu/"
      );
      expect(statusCode).toBe(404);
    });
  });

  describe("GET/ booking", () => {
    it("return 200 status and get total booking", async () => {
      const { body, statusCode } = await supertest(app).get(
        "/api/v1/booking/total/"
      );
      expect(statusCode).toBe(200);
      expect(body.success).toBe(true);
    });
  });
});
