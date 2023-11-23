const router = require("express").Router();
const Product = require("../models/Product");
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("./verifyToken");

// CREATE
router.post("/", verifyTokenAndAdmin, async (req, resp) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    resp.status(201).json(savedProduct);
  } catch (error) {
    resp.status(500).json({
      error_message: error
    });
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, resp) => {
  if (!req.params.id) {
    resp.status(404).json({
      error_message: "Not found"
    });
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    resp.status(200).json(updatedProduct);
  } catch (error) {
    resp.status(500).json({
      error_message: error
    });
  }
});

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, resp) => {
  if (!req.params.id) {
    resp.status(404).json({
      error_message: "Not found"
    });
  }
  try {
    await Product.findByIdAndDelete(req.params.id);
    resp.status(200).json({
      response_message: "Product has been deleted !",
    });
  } catch (error) {
    resp.status(500).json({
      error_message: error
    });
  }
});

// GET
router.get("/find/:id", verifyTokenAndAuthorization, async (req, resp) => {
  if (!req.params.id) {
    resp.status(404).json({
      error_message: "Not found"
    });
  }
  try {
    const product = await Product.findById(req.params.id);
    resp.status(200).json(product);
  } catch (error) {
    resp.status(500).json({
      error_message: error
    });
  }
});

// GET Products
router.get("/", verifyTokenAndAuthorization, async (req, resp) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;

  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    resp.status(200).json(products);
  } catch (error) {
    resp.status(500).json({
      error_message: error
    });
  }
});

module.exports = router;
