const JWT = require("jsonwebtoken");

const verifyToken = (req, resp, next) => {
  const authHeader = req.headers.token;
  const token = authHeader.split(" ")[1];
  if (authHeader && token) {
    JWT.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) resp.status(403).json("Token is not valid !");

      req.user = user;
      next();
    });
  } else {
    resp.status(401).json({
      error_message: "You are not authorised !",
    });
  }
};

const verifyTokenAndAuthorization = (req, resp, next) => {
  verifyToken(req, resp, () => {
    // if id is same or if admin
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      resp.status(403).json({
        error_message: "You are not allowed to perform this operation !",
      });
    }
  });
};

const verifyTokenAndAdmin = (req, resp, next) => {
  verifyToken(req, resp, () => {
    // if id is same or if admin
    console.log("user info", req);

    if (req.user.isAdmin) {
      next();
    } else {
      resp.status(403).json({
        error_message: "You are not allowed to perform this operation !",
      });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin
};
