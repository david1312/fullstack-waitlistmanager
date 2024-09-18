import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/mongo";
import queueRoutes from "./routes/queueRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use("/api", queueRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
