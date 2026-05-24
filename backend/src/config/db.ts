import mongoose from "mongoose";
import { logger } from "../utils/logger";

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI as string;

  mongoose.connection.on("connected", () =>
    logger.info("MongoDB connected successfully"),
  );
  mongoose.connection.on("error", (err) =>
    logger.error("MongoDB connection error:", err),
  );
  mongoose.connection.on("disconnected", () =>
    logger.warn("MongoDB disconnected"),
  );

  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
    process.exit(0);
  });

  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
};

export default connectDB;
