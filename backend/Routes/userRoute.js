import express from 'express';
import isLogin from '../middleware/isLogin.js';
import { getUserBySearch , getCurrentChatters } from '../routeControllers/userhandlerControllers.js';
import User from "../Models/userModels.js";

const router = express.Router();

router.get('/search',isLogin,getUserBySearch);

router.get('/currentchatters',isLogin,getCurrentChatters)

// ✅ Update profile route
router.put("/update", isLogin, async (req, res) => {
  try {
    const { fullName, bio, profilepic } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // protectRoute middleware se user milta hai
      { fullName, bio, profilepic },
      { new: true } // naya updated data return karega
    ).select("-password"); // password ko exclude karo

    res.json(updatedUser);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
});


// ✅ Get all users
router.get("/all", isLogin, async (req, res) => {
  try {
    const users = await User.find({}, "username fullName bio profilepic");
    res.json(users);
  } catch (err) {
    console.error("Users fetch error:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ✅ Get single user by ID
router.get("/:id", isLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, "username fullName bio profilepic");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Single user fetch error:", err);
    res.status(500).json({ message: "Error fetching user" });
  }
});


export default router;