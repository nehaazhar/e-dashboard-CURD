require("dotenv").config();
const express = require("express");
const cors = require("cors");
const CryptoJS = require("crypto-js");
const mongoose = require("mongoose");

require("./db/config");
const User = require("./db/users");
const Product = require("./db/Product");
const Jwt = require("jsonwebtoken");
const JwtKey = process.env.JWT_SECRET;
const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to E-Commerce Product Management API!");
});

app.post("/register", async (req, resp) => {
  try {
    // Encrypt the password
    const secretKey = process.env.CRYPTO_SECRET_KEY;
    const encryptedPassword = CryptoJS.AES.encrypt(
      req.body.password,
      secretKey,
    ).toString();

    let userData = {
      ...req.body,
      password: encryptedPassword,
    };

    let user = new User(userData);
    let result = await user.save();
    result = result.toObject();
    delete result.password;

    Jwt.sign({ result }, JwtKey, { expiresIn: "2h" }, (err, token) => {
      if (err) {
        resp.send({ result: "something went wrong" });
      }
      resp.send({ result, auth: token });
    });
  } catch (error) {
    resp.status(500).send({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
});

app.post("/login", async (req, resp) => {
  console.log(req.body);
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      Jwt.sign({ user }, JwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          resp.send({ result: "something went wrong" });
        }
        resp.send({ user, auth: token });
      });
    } else {
      resp.send({ result: "No user found" });
    }
  } else {
    resp.send({ result: "No user found" });
  }
});

app.post("/add-product", verifyToken, async (req, resp) => {
  let product = new Product(req.body);
  let result = await product.save();
  resp.send(result);
});

app.get("/products", verifyToken, async (req, resp) => {
  const { search, company, user, category } = req.query;

  let filter = {};

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (company) {
    filter.company = company;
  }

  if (category) {
    filter.category = category;
  }

  if (user) {
    filter.userid = new mongoose.Types.ObjectId(user);
  }

  try {
    let products = await Product.find(filter).populate({
      path: "userid",
      select: "name",
    });

    resp.json(products);
  } catch (error) {
    resp.status(500).json({ message: "Server Error" });
  }
});

app.delete("/product/:id", verifyToken, async (req, resp) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    if (result.deletedCount > 0) {
      resp.json({ success: true, message: "Product deleted successfully" });
    } else {
      resp.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    resp.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.get("/product/:id", verifyToken, async (req, resp) => {
  try {
    const result = await Product.findOne({ _id: req.params.id });

    if (result) {
      resp.json(result);
    } else {
      resp.status(404).json({ result: "No record found" });
    }
  } catch (error) {
    resp.status(500).json({ error: "Invalid ID or Server Error" });
  }
});

app.put("/product/:id", verifyToken, async (req, resp) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    },
  );
  resp.send(result);
});

app.get("/search/:key", verifyToken, async (req, resp) => {
  try {
    const key = req.params.key.toLowerCase();

    const users = await User.find({
      name: { $regex: key, $options: "i" },
    });

    const userIds = users.map((user) => user._id);

    let result = await Product.find({
      $or: [
        { name: { $regex: key, $options: "i" } },
        { company: { $regex: key, $options: "i" } },
        { category: { $regex: key, $options: "i" } },
        { price: { $regex: key, $options: "i" } },
        { userid: { $in: userIds } },
      ],
    }).populate({
      path: "userid",
      select: "name",
    });

    if (!result || (Array.isArray(result) && result.length === 0)) {
      resp.status(404).send({ result: "No record found" });
    } else {
      resp.send(result);
    }
  } catch (error) {
    resp.status(500).send({ result: "Error fetching data" });
  }
});

app.get("/categories", verifyToken, async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.send(categories);
  } catch (err) {
    res.status(500).send("Error fetching categories");
  }
});

app.get("/companies", verifyToken, async (req, res) => {
  try {
    const companies = await Product.distinct("company");
    res.send(companies);
  } catch (err) {
    res.status(500).send("Error fetching companies");
  }
});

app.get("/users", verifyToken, async (req, res) => {
  try {
    const userIds = await Product.distinct("userid");

    const users = await User.find({
      _id: { $in: userIds },
    }).select("name");

    res.send(users);
  } catch (error) {
    res.status(500).send("Error fetching users");
  }
});

function verifyToken(req, resp, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    Jwt.verify(token, JwtKey, (err, valid) => {
      if (err) {
        resp
          .status(401)
          .send({ result: "Please provide valid token with header" });
      } else {
        next();
      }
    });
  } else {
    resp.status(403).send({ result: "Please add token with header" });
  }
}

app.listen(process.env.PORT || 5100, () => {
  console.log(`Server is running on port ${process.env.PORT || 5100}`);
});
