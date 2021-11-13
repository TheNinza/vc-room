const { auth } = require("../configs/firebase");

exports.decodeJWT = async (req, _res, next) => {
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    try {
      console.log("authorization header found");
      const token = req.headers.authorization.split("Bearer ")[1];
      const decoded = await auth.verifyIdToken(token);
      req["currentUser"] = decoded;
    } catch (error) {
      console.error(error);
    }
  }
  next();
};
