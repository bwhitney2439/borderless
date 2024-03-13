import express from "express";
import multer from "multer";
import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { ApiKeyCredentials } from "@azure/ms-rest-js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({
    inHeader: {
      "Ocp-Apim-Subscription-Key": process.env.COMPUTER_VISION_SUBSCRIPTION_KEY,
    },
  }),
  process.env.COMPUTER_VISION_ENDPOINT!
);
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Call the Read API with the file buffer
  try {
    const result = await computerVisionClient.readInStream(req.file.buffer);
    // Get operation ID from the result
    const operationId = result.operationLocation.split("/").slice(-1)[0];

    // Wait for the read operation to finish
    let operationResult;
    do {
      operationResult = await computerVisionClient.getReadResult(operationId);
    } while (operationResult.status === "running");

    if (!operationResult.analyzeResult) {
      return res.status(500).send("Error processing the image");
    }
    if (operationResult.status === "succeeded") {
      const textResults =
        operationResult.analyzeResult.readResults[0].lines.map(
          (line) => line.text
        );
      const dob = textResults
        .find((text) => text.includes("Date of birth"))
        .split(" ")[4];
      const expiry = textResults
        .find((text) => text.includes("Date of expiry"))
        .split(" ")[4];

      res.json({ dateOfBirth: dob, dateOfExpiry: expiry });
    } else {
      res.status(500).send("Failed to process the document");
    }

    // Collect and send detected text
    const detectedTexts = operationResult.analyzeResult.readResults.flatMap(
      (page) => page.lines.map((line) => line.text)
    );

    res.json({ detectedTexts });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing the image");
  }
});

export default router;
