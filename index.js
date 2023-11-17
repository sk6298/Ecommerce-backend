const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./routes/user");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");
const productRoute = require("./routes/product");
const authRoute = require("./routes/auth");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => {
    console.log("Database connection successful !");
  })
  .catch((err) => {
    console.log("Failed to connect to DB.");
  });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/orders", orderRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/checkout", stripeRoute);

app.get("/test", (req,res) => {
  res.json("Working fine");
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`http://localhost:${process.env.PORT || 5000}/`);
});
