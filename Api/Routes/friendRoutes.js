const express = require("express");
const friendrouter = express.Router();
const Friends = require("../models/friendRequests");
const User = require("../models/user");

friendrouter.post("/addfriend", async (req, res) => {
    const sender = req.user;
    const receiver = req.body;
    //1.check whether friend exists in our APP 
    const frnd_email_exists = await User.findOne({ email: receiver.email });
    if (!frnd_email_exists) {
        return res.status(400).json({ message:  receiver.email + " is not registered. Please register first" });
    }
    //2.first check whether user is already his friend or not
    const user_is_ardy_frnd = await User.findOne({ _id: sender.id }).populate("friends", "email").lean();
    if(user_is_ardy_frnd.friends.includes(receiver.email)){
       return res.status(400).json({ message: receiver.email + " is already your friend" });
    }
    // 3.check whether a user has alrdy sent him the friend request exists
    // =>either sender sent the request or receiver sent the request already so check both cases

    const user_has_sent_request = await Friends.findOne({$or:[{senderemail:sender.email,receiveremail:receiver.email,status:"pending"},{senderemail:receiver.email,receiveremail:sender.email,status:"pending"}]});
    if(user_has_sent_request){
       return res.status(400).json({ message: "You have already sent/received a friend request to/from " + receiver.email });
    }
    // 4.create a friend request
    try{
        const send_frnd_req = new Friends();
        send_frnd_req.senderemail = sender.email;
        send_frnd_req.receiveremail = receiver.email;
        send_frnd_req.status = "pending";
        send_frnd_req.sendername = sender.name;
        await send_frnd_req.save();
        res.status(200).json({ message: "Friend request sent successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get all friend requests
friendrouter.get("/getallfriendrequests", async (req, res) => {
    try {
        const user = req.user;
        const requests = await Friends.find({ receiveremail: user.email, status: "pending" });
        res.status(200).json({ frndrequests: requests });
    } catch (error) {    
        res.status(500).json({ message: error.message });
    }
});

module.exports = friendrouter;