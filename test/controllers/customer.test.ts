import {
  it,
  describe,
  expect,
} from "@jest/globals";
import supertest from "supertest";
import app from "../../src/app";
import { setupDB } from "../../src/configs/memoryServer";

describe("Test request with Mongo-inMemory-Server", () => {
  //usercontroller test
  describe("CustomerController ", () => {
    describe("Get list of Customer", () => {
      it("Should retrieve list of customer", async () => {
        const res = await supertest(app).get(`/api/v1/user/`);
        expect(res.body.success).toBe(true);
        expect(res.status).toBe(200);
      });
      it("should return 404 if no ID is invalid", async () => {
        const id = "663386553a51e2bc35eb3002";
        const response = await supertest(app).get(`/api/v1/user/${id}`);
        expect(response.status).toBe(404);
      });
      // it("Should get list of user with id", async () => {
      //   const payload = {
      //     id: "663866175d500bb94d829219"
      //   }
      //   const response = await supertest(app).get(`/api/v1/user/${payload.id}`)
      //   expect(response.status).toBe(200)
      // })
      it("Should give 500 internal server error", async () => {
        const id = "663386553a51e2bc35eb300";
        const response = await supertest(app).get(`/api/v1/user/${id}`);
        expect(response.status).toBe(500);
      });
    });
    describe("Update Customer", () => {
      // it("Should verify token and update customer", async()=>{
      //     const id = "663386553a51e2bc35eb3001"
      //     const response = await supertest(app).put(`/api/v1/user/update/${id}`).send({name: "Hello world!"})
      // });
      it("Should return 500 internal server", async () => {
        const id = "663866175d500bb94d829219";
        const response = await supertest(app)
          .put(`/api/v1/user/${id}`)
          .send({ name: "DPTERMINATOR" });
        expect(response.status).toBe(404);
      });
    });
    describe("Delete user", () => {
      describe("Delete customer by their id", () => {
        it("Should check return 404 id doesn't exist", async () => {
          const payload = {
            id: "6634750d0cbb8b710ad5d8ef"
          };
          const response = await supertest(app)
            .delete(`/api/v1/user/${payload.id}`)
            .send();
          expect(response.status).toBe(404);
        });
        // it("Should delete user by id", async () => {
        //   const payload = {
        //     id: "6634750d0cbb8b710ad5d8af"
        //   }
        //   const response = await supertest(app).delete(`/api/v1/user/${payload.id}`).send()
        //   expect(response.status).toBe(200)
        // })
        it("Should check return 404 id doesn't exist", async () => {
          const payload = {
            id: "6634750d0cbb8b710ad5d8a"
          };
          const response = await supertest(app)
            .delete(`/api/v1/user/${payload.id}`)
            .send();
          expect(response.status).toBe(500);
        });
      });
    });
  });

  //userAuth controller test
  describe("userAuthController ", () => {
    describe("Register User", () => {
      it("Should register new user", async () => {
        const payload = {
          name: "Dhrumil Parekh",
          email: "Test1234@example.com",
          phoneNumber: "8141467418",
          location: {
            type: "Point",
            coordinates: [23.070786151574477, 72.51760853268873]
          }
        };
        const response = await supertest(app)
          .post("/api/v1/user/register")
          .send(payload);
        expect(response.status).toBe(201);
      });
      it("Should Return 404 if Invalid/empty details", async () => {
        const payload = {
          name: "",
          phone: ""
        };
        const response = await supertest(app)
          .post("/api/v1/user/register")
          .send(payload);
        expect(response.status).toBe(404);
      });
      // it('should return 400 if user already exists', async () => {
      //   // First sign up the user
      //   const userData = {
      //     name: 'Test User',
      //     email: 'test@example.com',
      //     phoneNumber: '1234567890',
      //     role: 'user',
      //     location: 'Test Location'
      //   };

      //   await supertest(app)
      //     .post('/api/v1/user/register')
      //     .send(userData);

      //   // Attempt to sign up the same user again
      //   const response = await supertest(app)
      //     .post('/api/v1/user/register')
      //     .send(userData);

      //   expect(response.status).toBe(400);
      //   expect(response.body.success).toBe(false);
      //   expect(response.body.message).toBe('User Already exist.');
      // });
    });
    describe("Login User", () => {
      it("Should return 404 error for invalid/empty phoneNumber", async () => {
        const payload = {
          phoneNumber: "",
          lastDigit: "7418"
        };
        const response = await supertest(app)
          .post(`/api/v1/user/login`)
          .send(payload);
        expect(response.status).toBe(404);
      });

      // it("Should login user successfully", async()=>{
      //   const payload = {
      //    phoneNumber : "8141467418",
      //    lastDigit : "7418"
      //   }
      //   const response = await supertest(app).post(`/api/v1/user/login`).send(payload)
      //   expect(response.status).toBe(200)
      // })
      it("Should return 500 internal server error", async () => {
        const payload = {
          phoneNumber: "9857832165",
          lastDigit: "7418"
        };
        const response = await supertest(app)
          .post(`/api/v1/user/login`)
          .send(payload);
        expect(response.status).toBe(500);
      });
    });
    describe("Verify User", () => {
      it("should return 404 error for invalid/empty phoneNumber or otp", async () => {
        const payload = {
          phoneNumber: "",
          otp: ""
        };
        const response = await supertest(app)
          .post(`/api/v1/user/verify`)
          .send(payload);
        expect(response.status).toBe(404);
      });

      it("should return 404 error if no user found with provided phoneNumber", async () => {
        const payload = {
          phoneNumber: "987654123"
        };
        const response = await supertest(app)
          .post(`/api/v1/user/verify`)
          .send(payload);
        expect(response.status).toBe(404);
      });

      // it("should return 200 status code and set token cookie if user is verified", async () => {
      //   const payload = {
      //     phoneNumber: "8141467418",
      //     otp: "3540"
      //   };
      //   const response = await supertest(app).post(`/api/v1/user/verify`).send(payload);
      //   expect(response.status).toBe(200);
      //   expect(response.headers['set-cookie']).toBeDefined();
      // });

      it("should return 400 error for invalid OTP", async () => {
        const payload = {
          phoneNumber: "8141467418",
          otp: "8797"
        };
        const response = await supertest(app)
          .post(`/api/v1/user/verify`)
          .send(payload);
        expect(response.status).toBe(400);
      });

      it("should return 500 error if an internal server error occurs", async () => {
        const payload = {
          phoneNumber: "1234567890",
          otp: "123456"
        };
        const response = await supertest(app)
          .post(`/api/v1/user/verify`)
          .send(payload);
        expect(response.status).toBe(500);
      });
    });
  });
});
