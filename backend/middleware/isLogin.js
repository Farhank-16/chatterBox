import jwt from "jsonwebtoken";
import User from "../Models/userModels.js";

const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;  // <-- cookie-parser se
    // console.log("Token from cookie:", token);

    if (!token) {
      return res
        .status(401)
        .send({ success: false, message: "User unauthorized - No token" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).send({
        success: false,
        message: "User unauthorized - Invalid Token",
      });
    }

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User Not Found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(`Error in Login middleware: ${error.message}`);
    res.status(500).send({ success: false, message: error.message });
  }
};

export default isLogin;
