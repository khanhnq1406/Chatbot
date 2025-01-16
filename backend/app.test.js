const request = require("supertest");
const app = require("./index");

describe("Backend API Tests", () => {
  test("GET /history returns conversation history", async () => {
    const response = await request(app)
      .get("/api/history")
      .set("Cookie", "sessionId=mockSession");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test("POST /chat sends a message and returns a bot response", async () => {
    const response = await request(app)
      .post("/api/chat")
      .set("Cookie", "sessionId=mockSession")
      .send({ message: "Hello!" });
    expect(response.statusCode).toBe(200);
  });
});
