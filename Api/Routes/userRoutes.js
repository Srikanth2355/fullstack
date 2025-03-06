const express = require("express");
const userrouter = express.Router();
const User = require("../models/user");
const registerMiddleware = require("../Middlewares/register");
const loginMiddleware = require("../Middlewares/login");
const bcrypt = require("bcrypt");
const {signJWT,verifyJWT} = require("../utils/jwt");
const {checkLoggedIn} = require("../Middlewares/checkLoggedIn");
const {sendEmail} = require("../utils/EmailManager");
const {generateOTP,verifyOTP,deleteOTP} = require("../utils/OTPManager");

userrouter.post("/register",registerMiddleware, async (req, res) => {
    try {
        const user_data = req.body;
        const verifyotp = await verifyOTP(user_data.email, user_data.otp);
        if (!verifyotp) {
            return res.status(400).json({ message: "OTP verification failed! Please try again" });
        }
        const otpdeleted = await deleteOTP(user_data.email);
        const existing_user = await User.findOne({ email: user_data.email.toLowerCase() });
        if (existing_user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = new User();
        user.name = user_data.name;
        user.email = user_data.email;
        user.password = await bcrypt.hash(user_data.password, 10); // Hash user_data.password;
        await user.save();
        res.status(200).json({ message: "User registered successfully. Please login" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

userrouter.post("/login",loginMiddleware, async (req, res) => {
    try{
        const user_data = req.body;
        const getuser = await User.findOne({ email: user_data.email.toLowerCase() });
        if (!getuser) {
            return res.status(400).json({ message: "Please enter valid credentials" });
        }
        const password_match = await bcrypt.compare(user_data.password,getuser.password);
        if (!password_match) {
            return res.status(400).json({ message: "Please enter valid credentials" });
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
        res.status(500).json({ message: error.message });
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
        res.status(500).json({ message: error.message });
    }
});



// Api to generate otp of the given email
userrouter.post("/generateotp", async (req, res) => {
    try {
        const userdata = req.body;
        const existing_user = await User.findOne({ email: userdata.email.toLowerCase() });
        if (existing_user) {
            return res.status(400).json({ message: "User with emailid already exists.Please login" });
        }
        const otp = generateOTP(userdata.email,res);
        if (otp?.error) {
            return res.status(400).json({ message: otp.error });
        }
        const sendemail = await sendEmail(userdata.email,otp,userdata.name);
        if(sendemail){
            res.status(200).json({ message: "OTP sent successfully" });
        }else{
            res.status(500).json({ message: "Failed to send OTP" });
        }
    } catch (error) {   
        res.status(500).json({ message: error.message });
    }
});

// Api to send otp for reset password
userrouter.post("/forgot-password", async (req, res) => {
    try {
        const userdata = req.body;
        const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(userdata.email.toLowerCase() == "srikanth@gmail.com") {
            userdata.email = "theetakenotes@gmail.com"
        }
        if(!email_regex.test(userdata.email)) {
            return res.status(400).json({ error: "Please enter a valid email" });
        }
        const existing_user = await User.findOne({ email:
        userdata.email.toLowerCase() });
        if (!existing_user) {
            return res.status(400).json({ message: "User not found" });
        }
        const otp = generateOTP(userdata.email);
        if (otp?.error) {
            return res.status(400).json({ message: otp.error });
        }
        const sendemail = await sendEmail(userdata.email,otp,'',"OTP for resetting password");
        if(sendemail){
            res.status(200).json({ message: "OTP sent successfully" });
        }else{
            res.status(500).json({ message: "Failed to send OTP" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }    
});

// Api to handle reset password
userrouter.post("/reset-password", async (req, res) => {
    try{
        const user_data = req.body;
        if(user_data.email.toLowerCase() == "srikanth@gmail.com") {
            user_data.email = "theetakenotes@gmail.com"
        }
        const password_regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])/;
        if(user_data.password != user_data.confirm) {
            return res.status(400).json({ message: "Password and confirm password do not match" });
        }
        if(!password_regex.test(user_data.password)) {
            return res.status(400).json({ message: "Password donot match the requirements." });
        }
        const verifyotp = await verifyOTP(user_data.email, user_data.otp);

        if (!verifyotp) {
            return res.status(400).json({ Message: "OTP verification failed! Please try again" });
        }
        const user = await User.findOne({ email: user_data.email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        user.password = await bcrypt.hash(user_data.password, 10); // Hash user_data.password;
        await user.save();
        res.status(200).json({ message: "Password has been reset successfully. Please login" });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
});


module.exports = userrouter;