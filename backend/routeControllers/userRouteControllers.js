import User from "../Models/userModels.js";
import bcryptjs from "bcryptjs";
import jwtToken from "../utils/jwtwebToken.js";

export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password, profilepic } = req.body;

        // Check if username or email already exists
        const user = await User.findOne({ username , email });
        if (user) {
            return res.status(400).json({ success: false, message: "Username or Email Already Exists" });
        }

        // Hash password
        const hashPassword = bcryptjs.hashSync(password, 8);

        // Assign default profile picture if not provided
        const defaultPic = gender === "male"
            ? `https://avatar.iran.liara.run/public/boy?username=${username}`
            : `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname,
            username,
            email,
            gender,
            password: hashPassword,
            profilepic: profilepic || defaultPic
        });

        if(newUser){
        await newUser.save();
         jwtToken(newUser._id,res)
        }else{
            res.status(500).send({success:false, message:"Invalid User Data"})
        }
        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilepic: newUser.profilepic,
            email: newUser.email,
            message:"User Registered Succesfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Server error"
        });
        console.log(error)
    }
};

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ success: false, message: "Email doesn't exist" });
        }

        const comparePass = bcryptjs.compareSync(password, user.password || "");
        if (!comparePass) {
            return res.status(401).send({ success: false, message: "Email or Password doesn't match" });
        }

        // Generate and set JWT token
        jwtToken(user._id, res);

        res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic,
            email: user.email,
            message: "Successfully Logged In"
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Server error"
        });
    }
};

export const userLogOut = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,   // Prevents access from JS
            secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
            sameSite: "strict", // Prevent CSRF
            expires: new Date(0) // Expire instantly
        });

        res.status(200).send({message: "User logged out successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};


