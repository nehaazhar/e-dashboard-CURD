const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    category: String,
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "users" }, // Reference to User collection
    company: String
});

module.exports = mongoose.model("products", productSchema);
