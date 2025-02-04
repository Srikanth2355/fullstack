const express = require("express");
const userrouter = express.Router();
const User = require("../models/user");
const registerMiddleware = require("../Middlewares/register");
const loginMiddleware = require("../Middlewares/login");
const bcrypt = require("bcrypt");
const {signJWT,verifyJWT} = require("../utils/jwt");

userrouter.post("/register",registerMiddleware, async (req, res) => {
    try {
        const user_data = req.body;
        const existing_user = await User.findOne({ email: user_data.email });
        if (existing_user) {
            return res.status(400).json({ error: "User already exists" });
        }
        const user = new User();
        user.name = user_data.name;
        user.email = user_data.email;
        user.password = await bcrypt.hash(user_data.password, 10); // Hash user_data.password;
        await user.save();
        res.status(200).json({ message: "User registered successfully. Please login" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

userrouter.post("/login",loginMiddleware, async (req, res) => {
    try{
        const user_data = req.body;
        const getuser = await User.findOne({ email: user_data.email });
        if (!getuser) {
            return res.status(400).json({ error: "User not found" });
        }
        const password_match = await bcrypt.compare(user_data.password,getuser.password);
        if (!password_match) {
            return res.status(400).json({ error: "Invalid password" });
        }
        const token = signJWT({id:getuser._id,email:getuser.email,role:getuser.role});
        res.cookie('jwtToken', token, {
            httpOnly: true, // Prevent access from JavaScript
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            maxAge: 12 * 60 * 60 * 1000, // 12 hrs in milliseconds
            sameSite: 'strict', // Prevent CSRF
        });
        const userobj = {id:getuser._id,email:getuser.email,role:getuser.role,name:getuser.name};
        res.status(200).json({ message: "User logged in successfully", userdata :userobj });

    }catch(error){
        res.status(500).json({ error: error.message });
    }
});

userrouter.get("/logout",(req, res) => {
    res.clearCookie('jwtToken',{ httpOnly: true, sameSite: 'strict', secure: true });
    res.status(200).json({ message: "User logged out successfully" });
})

module.exports = userrouter;