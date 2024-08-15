import supertest from "supertest";
import { it, describe, expect } from "@jest/globals";
import app from "../../src/app";
import { setupDB } from "../../src/configs/memoryServer";

describe("Test request with Mongo-inMemory-Server", () => {
  setupDB();
  describe("Get list of driver", () => {
    it("Should retrieve list of driver", async () => {
      const res = await supertest(app).get(`/api/v1/driver/`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 404 if no ID is invalid", async () => {
      const id = "663386553a51e2bc35eb3002";
      const response = await supertest(app).get(`/api/v1/driver/${id}`);
      expect(response.status).toBe(404);
    });

    it("Should give 500 internal server error", async () => {
      const id = "663386553a51e2bc35eb300";
      const response = await supertest(app).get(`/api/v1/driver/${id}`);
      expect(response.status).toBe(500);
    });
  });

  describe("Delete customer by their id", () => {
    // it("Should check return 404 id doesn't exist", async () => {
    //   const payload = {
    //     id: "6634750d0cbb8b710ad5d"
    //   }
    //   const response = await supertest(app).delete(`/api/v1/driver/${payload.id}`).send()
    //   expect(response.status).toBe(404)
    // });

    it("Should check return 500 id doesn't exist", async () => {
      const payload = {
        id: "6634750d0cbb8b710ad5d"
      };
      const response = await supertest(app)
        .delete(`/api/v1/driver/${payload.id}`)
        .send();
      expect(response.status).toBe(500);
    });
  });
});
