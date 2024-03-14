import { NextFunction, Request, Response } from "express";
import ErrorResponse from "./interfaces/ErrorResponse";
import multer from "multer";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_, file, cb) => {
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      return cb(new Error("File type not supported"));
    }
    cb(null, true);
  },
});
