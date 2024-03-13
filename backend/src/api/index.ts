import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import emojis from "./emojis";
import passport from "./passport";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/emojis", emojis);
router.use("/passport", passport);

export default router;
