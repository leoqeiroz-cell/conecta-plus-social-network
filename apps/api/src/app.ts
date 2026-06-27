import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { env } from "@/config/env.js";
import { openApiSpec } from "@/docs/openapi.js";
import { errorHandler } from "@/middlewares/error-handler.js";
import { routes } from "@/routes/index.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use("/api", routes);
app.use(errorHandler);
