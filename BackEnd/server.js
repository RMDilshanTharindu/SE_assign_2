const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const authRoutes = require("./routes/authRoutes");

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Campus Resource Management API is running...");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});