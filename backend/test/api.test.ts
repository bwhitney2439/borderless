import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../src/app";

// Mocking Mindee client
vi.mock("mindee", () => {
  const originalModule = vi.importActual("mindee");
  return {
    ...originalModule,
    Client: vi.fn().mockImplementation(() => ({
      docFromBuffer: vi.fn(),
      parse: vi.fn().mockResolvedValue({
        document: {
          inference: {
            prediction: {
              birthDate: { value: "1990-01-01", confidence: 1 },
              expiryDate: { value: "2030-01-01", confidence: 1 },
            },
          },
        },
      }),
    })),
    product: {
      PassportV1: "PassportV1",
    },
  };
});

describe("POST /api/v1/passport/upload", () => {
  it("successfully processes a valid file upload", async () => {
    const response = await request(app)
      .post("/api/v1/passport/upload")
      .attach("file", Buffer.from("mock file data", "utf-8"), "passport.jpg");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      birthDate: "1990-01-01",
      expiryDate: "2030-01-01",
    });
  });
});
