import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // ✅

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/stores", storeRoutes);
app.use("/admin", adminRoutes); // ✅ must be a router

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
