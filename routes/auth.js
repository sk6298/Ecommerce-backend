const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, resp) => {
  const { username, password, email, isAdmin } = req.body;
  if (!username || !password || !email) {
    resp.status(400).json({
      error_message: "Please fill username, password & email.",
    });
  }
  const newUser = new User({
    username,
    password: CryptoJS.AES.encrypt(
      password,
      process.env.CRYPTO_SECRET_KEY
    ).toString(),
    email,
    isAdmin: isAdmin || false,
  });

  try {
    const savedUser = await newUser.save();
    resp.status(201).json(savedUser);
    console.log("User created successfully !");
  } catch (error) {
    resp.status(500).json(error);
    console.log("Failed to create user");
  }
});

// LOGIN
router.post("/login", async (req, resp) => {
  const { username } = req.body;
  if (!username || !req.body.password) {
    resp.status(400).json({
      error_message: "Please fill username & password.",
    });
  }

  try {
    const user = await User.findOne({
      username,
    });

    !user &&
      resp.status(401).json({
        error_message: "Wrong credentials !!!",
      });

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTO_SECRET_KEY
    );
    const decryptPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    req.body.password != decryptPassword &&
      resp.status(401).json({
        error_message: "Password doesn't match !!!",
      });

    const { password, ...userInfo } = user._doc;
    // We should not reveil our password after login
    const accessToken = JWT.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      {expiresIn: "3d"}
    );

    resp.status(200).json({...userInfo,accessToken});
    console.log(username + "logged in successfully!");
  } catch (error) {
    resp.status(500).json(error);
  }
});

module.exports = router;
