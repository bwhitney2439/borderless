import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import passport from "./passport";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/passport", passport);

export default router;
