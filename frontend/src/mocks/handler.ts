import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/v1/passport/upload", async ({ request }) => {
    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return new HttpResponse("Missing document", { status: 400 });
    }

    if (!(file instanceof File)) {
      return new HttpResponse("Uploaded document is not a File", {
        status: 400,
      });
    }

    return HttpResponse.json({
      birthDate: "1990-01-01",
      expiryDate: "2025-01-01",
    });
  }),
];
