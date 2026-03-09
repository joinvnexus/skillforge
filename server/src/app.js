import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { HttpError } from "./lib/http-error.js";
import { errorHandler } from "./middlewares/error-handler.js";
import routes from "./routes/index.js";

const app = express();

const allowedOrigins = new Set([
  env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000"
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "skillshare-api"
  });
});

app.use(env.API_PREFIX, routes);

app.use((req, _res, next) => {
  next(new HttpError(404, `Route not found: ${req.originalUrl}`));
});

app.use(errorHandler);

export default app;
