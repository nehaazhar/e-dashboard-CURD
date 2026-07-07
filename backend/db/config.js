const mongoose = require("mongoose");
// Agar process.env.MONGO_URI mile toh wo use kare, nahi toh backup me localhost
const dbURI = process.env.MONGO_URI; // Use environment variable
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));
