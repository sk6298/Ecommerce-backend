const router = require("express").Router();
const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

// CREATE
router.post("/", verifyToken, async (req, resp) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    resp.status(201).json(savedCart);
  } catch (error) {
    resp.status(500).json({
      error_message: error,
    });
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, resp) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
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
router.delete("/:id", verifyTokenAndAuthorization, async (req, resp) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    resp.status(200).json({
      response_message: "Cart has been deleted !",
    });
  } catch (error) {
    resp.status(500).json({
      error_message: error,
    });
  }
});

// GET CART with userid
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, resp) => {
  try {
    const cart = await Cart.findOne({
      userId: req.params.userId,
    });
    resp.status(200).json(cart);
  } catch (error) {
    resp.status(500).json({
      error_message: error,
    });
  }
});

// GET USER CART
router.get("/", verifyTokenAndAdmin, async (req, resp) => {
  try {
    let carts = await Cart.find();

    resp.status(200).json(carts);
  } catch (error) {
    resp.status(500).json({
      error_message: error,
    });
  }
});

module.exports = router;
