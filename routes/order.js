const router = require("express").Router();
const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// CREATE
router.post("/", verifyToken, async (req, resp) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    resp.status(201).json(savedOrder);
  } catch (error) {
    resp.status(500).json({
      error_message: error,
    });
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, resp) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    resp.status(200).json(updatedCart);
  } catch (error) {
    resp.status(500).json({
      error_message: error,
    });
  }
});

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, resp) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    resp.status(200).json({
      response_message: "Order has been deleted !",
    });
  } catch (error) {
    resp.status(500).json({
      error_message: error,
    });
  }
});

// GET Order with userid
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, resp) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId,
    });
    resp.status(200).json(orders);
  } catch (error) {
    resp.status(500).json({
      error_message: error,
    });
  }
});

// GET USER CART
router.get("/", verifyTokenAndAdmin, async (req, resp) => {
  try {
    let orders = await Order.find();

    resp.status(200).json(orders);
  } catch (error) {
    resp.status(500).json({
      error_message: error,
    });
  }
});

// Monthly Income
router.get("/income", verifyTokenAndAdmin, async (req, resp) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const data = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: prevMonth },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount"
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);

    resp.status(200).json(data);
  } catch (error) {
    resp.status(500).json({
      error_message: error,
    });
  }
});

module.exports = router;
