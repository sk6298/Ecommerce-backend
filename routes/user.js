const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");
const router = require("express").Router();
const User = require("../models/User");

// UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, resp) => {
  if (!req.params.id) {
    resp.status(404).json({
      error_message: "Not found"
    });
  }

  let { password } = req.body;

  if (password) {
    // encrypt and update before storing
    password = CryptoJS.AES.encrypt(
      password,
      process.env.CRYPTO_SECRET_KEY
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    resp.status(200).json(updatedUser);
  } catch (error) {
    resp.status(500).json({
      error_message: error,
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
    await User.findByIdAndDelete(req.params.id);
    resp.status(200).json({
      response_message: "User has been deleted !",
    });
  } catch (error) {
    resp.status(500).json({
      error_message: error,
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
    const user = await User.findById(req.body.id);
    const { password, ...userInfo } = user;
    resp.status(200).json(userInfo);
  } catch (error) {
    resp.status(500).json({
      error_message: error,
    });
  }
});

// GET USERS
router.get("/", verifyTokenAndAdmin, async (req, resp) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    const usersInfo = users.map((u) => {
      const { password, ...userInfo } = u;
      return userInfo;
    });

    resp.status(200).json(usersInfo);
  } catch (error) {
    resp.status(500).json({
      error_message: error,
    });
  }
});

// GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, resp) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: lastYear },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
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
