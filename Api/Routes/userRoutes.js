const express = require("express");
const userrouter = express.Router();
const User = require("../models/user");
const registerMiddleware = require("../Middlewares/register");
const loginMiddleware = require("../Middlewares/login");
const bcrypt = require("bcrypt");
const {signJWT,verifyJWT} = require("../utils/jwt");
const {checkLoggedIn} = require("../Middlewares/checkLoggedIn");
const {sendEmail} = require("../utils/EmailManager");
const {generateOTP,verifyOTP} = require("../utils/OTPManager");

userrouter.post("/register",registerMiddleware, async (req, res) => {
    try {
        const user_data = req.body;
        const verifyotp = await verifyOTP(user_data.email, user_data.otp);
        if (!verifyotp) {
            return res.status(400).json({ error: "OTP verification failed! Please try again" });
        }
        const otpdeleted = await deleteOTP(user_data.email);
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
        const token = signJWT({id:getuser._id,email:getuser.email,role:getuser.role,name:getuser.name});
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

userrouter.get("/checklogin",checkLoggedIn,async (req, res) => {
    try{
        res.status(200).json({ message: "User is logged in", userdata: req.user });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
});



// Api to generate otp of the given email
userrouter.post("/generateotp", async (req, res) => {
    try {
        const userdata = req.body;
        const existing_user = await User.findOne({ email: userdata.email });
        if (existing_user) {
            return res.status(400).json({ error: "User with emailid already exists.Please login" });
        }
        const otp = generateOTP(userdata.email,res);
        if (otp?.error) {
            return res.status(400).json({ error: otp.error });
        }
        const sendemail = await sendEmail(userdata.email,otp,userdata.name);
        if(sendemail){
            res.status(200).json({ message: "OTP sent successfully" });
        }else{
            res.status(500).json({ error: "Failed to send OTP" });
        }
    } catch (error) {   
        res.status(500).json({ error: error.message });
    }
});

// Api to send otp for reset password
userrouter.post("/forgot-password", async (req, res) => {
    try {
        const userdata = req.body;
        const existing_user = await User.findOne({ email:
        userdata.email });
        if (!existing_user) {
            return res.status(400).json({ error: "User not found" });
        }
        const otp = generateOTP(userdata.email);
        if (otp?.error) {
            return res.status(400).json({ error: otp.error });
        }
        const sendemail = await sendEmail(userdata.email,otp,'',"OTP for resetting password");
        if(sendemail){
            res.status(200).json({ message: "OTP sent successfully" });
        }else{
            res.status(500).json({ error: "Failed to send OTP" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }    
});

// Api to handle reset password
userrouter.post("/reset-password", async (req, res) => {
    try{
        const user_data = req.body;
        const verifyotp = await verifyOTP(user_data.email, user_data.otp);
        if (!verifyotp) {
            return res.status(400).json({ error: "OTP verification failed! Please try again" });
        }
        const user = await User.findOne({ email: user_data.email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }
        user.password = await bcrypt.hash(user_data.password, 10); // Hash user_data.password;
        await user.save();
        res.status(200).json({ message: "Password has been reset successfully. Please login" });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
});


module.exports = userrouter;