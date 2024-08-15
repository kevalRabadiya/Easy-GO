import supertest from "supertest";
import { it, describe, expect } from "@jest/globals";
import app from "../src/app";
import { setupDB } from "../src/configs/memoryServer";

describe("GET /", () => {
  setupDB();
  it("responds with 200 and a welcome message", async () => {
    const response = await supertest(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toContain("🚀Welcome to EasyGo-API 🚕..");
  });
});

