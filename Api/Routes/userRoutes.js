const express = require("express");
const userrouter = express.Router();
const User = require("../models/user");
const registerMiddleware = require("../Middlewares/register");
const bcrypt = require("bcrypt");

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
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = userrouter;