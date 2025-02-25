import mongoose from "mongoose";
import app from "./app";
import { Server } from "http";
let server: Server;

async function ConnectDB() {
  try {
    await mongoose.connect(process.env.DB_URL as string);
    server = app.listen(process.env.PORT || 5000, () => {
      console.log("Server is running on port", process.env.PORT);
    });
  } catch (error) {
    console.log(error);
  }
}

ConnectDB();
const shudDownServer = () => {
  console.log("Server Shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });

  setTimeout(() => {
    console.log("Forcing Shutdown");
    process.exit(1);
  }, 4000);
};
process.on("uncaughtException", (error) => {
  console.log(error);
  if (server) {
    server.close(() => process.exit(1));
  }
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.log(error);
  process.exit(1);
});

process.on("SIGINT", shudDownServer);
process.on("SIGTERM", shudDownServer);
