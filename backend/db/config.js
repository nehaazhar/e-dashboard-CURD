const mongoose = require("mongoose");
// Agar process.env.MONGO_URI mile toh wo use kare, nahi toh backup me localhost
const dbURI = process.env.MONGO_URI || "mongodb://localhost:27017/e-commerce";

mongoose.connect(dbURI);
