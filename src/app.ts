import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { notFound, errorHandler } from "./middlewares/errorHandler";

// Import Routes
import authRoutes from "./modules/auth/auth.routes";

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Performance Middlewares
app.use(compression());

// Request Parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Logging
app.use(morgan("dev"));

// Health Check
app.get("/health", (_req, res) => {
  res.json({ status: "Server is Online..." });
});

// API Routes
app.use("/api/v1/auth", authRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
