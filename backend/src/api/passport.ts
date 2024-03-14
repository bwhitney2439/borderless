import express from "express";
import * as mindee from "mindee";
import { DateField } from "mindee/src/parsing/standard";
import { upload } from "../middlewares";

const router = express.Router();

const isPredictionValid = (prediction: DateField) => {
  return prediction.value !== undefined && prediction.confidence === 1;
};

// Init a new client
const mindeeClient = new mindee.Client({
  apiKey: process.env.MINDEE_API_KEY!,
});

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const inputSource = mindeeClient.docFromBuffer(
      req.file.buffer,
      req.file.originalname
    );

    // Parse the file
    const apiResponse = await mindeeClient.parse(
      mindee.product.PassportV1,
      inputSource
    );

    const { birthDate, expiryDate } = apiResponse.document.inference.prediction;

    if (!isPredictionValid(birthDate) || !isPredictionValid(expiryDate)) {
      return res
        .status(400)
        .send({ message: "Could not extract passport information" });
    }

    return res.send({
      birthDate: birthDate.value,
      expiryDate: expiryDate.value,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

export default router;
