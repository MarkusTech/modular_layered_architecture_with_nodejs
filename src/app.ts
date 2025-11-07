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
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { setupSwagger } from "./swagger";

// Import Routes
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import kycRoutes from "./modules/kyc/kyc.routes";
import paymentRoutes from "./modules/payment/payment.routes";

// Import Controller
import { KycController } from "./modules/kyc/kyc.controller";

// Load environment variables
dotenv.config();

const app = express();

// Setup Swagger Documentation
setupSwagger(app);

app.set("trust proxy", 1);

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
if (process.env.NODE_ENV === "production") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  });
  app.use(limiter);
}

// Logging
app.use(morgan("dev"));

// Health Check
app.get("/health", (_req, res) => {
  res.json({ status: "Server is Online..." });
});

app.get("/", (_req, res) => {
  res.json({ status: "Server is Online..." });
});

const kycController = new KycController();
app.post(
  "/api/v1/kyc",
  express.raw({ type: "application/json" }),
  kycController.webhook.bind(kycController)
);

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/kyc", kycRoutes);
app.use("/api/v1/payments", paymentRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);
app.use(globalErrorHandler);

export default app;
