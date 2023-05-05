import * as dotenv from "dotenv";
dotenv.config();
import rateLimit from "express-rate-limit";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createStream } from "rotating-file-stream";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";

import "./models/index.js";
import router from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const accessLogStream = createStream("access.log", {
    interval: "1d",
    path: path.join(__dirname, "logs", "access")
});

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 65,
    standardHeaders: true,
    legacyHeaders: false
});

app.use(limiter);
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.static("public"));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

const httpServer = createServer(app);
const PORT = process.env.APP_PORT ?? 8081;

app.use("/api", router);

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});