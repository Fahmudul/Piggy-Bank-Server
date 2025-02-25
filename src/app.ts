import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import router from "./app/Routes";
import { GlobalErrorHandler } from "./app/Errors/GlobalErrorHandler";
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use("/api/v1", router);
app.get("/", async (req: Request, res: Response) => {
  res.send("Hello from piggy bank server");
});
app.use(GlobalErrorHandler);
export default app;
