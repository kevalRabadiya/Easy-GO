import supertest from "supertest";
import app from "../../src/app";

describe("Distance matrix API test", () => {
  describe("Get distancematrix", () => {
    it("Should retrieve data with 200 ok", async () => {
      const payload = {
        origins:
          "201, Isquare Corporate Park, Science City Rd, Science City, Panchamrut Bunglows II, Sola, Ahmedabad, Gujarat 380060",
        destinations:
          "Sarkhej - Gandhinagar Hwy, Thaltej, Ahmedabad, Gujarat 380054"
      };
      const res = await supertest(app)
        .get(`/api/v1/user/maps/distance`)
        .send(payload);
      expect(res.status).toBe(200);
    });
    it("Should retrieve 500 with internal server error", async () => {
      const payload = {
        origins:
          "201, Isquare Corporate Park, Science City Rd, Science City, Panchamrut Bunglows II, Sola, Ahmedabad, Gujarat 380060"
      };
      const res = await supertest(app)
        .get(`/api/v1/user/maps/distance`)
        .send(payload);
      expect(res.status).toBe(500);
    });
  });
});
