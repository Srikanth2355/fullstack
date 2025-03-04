const express = require("express");
const mongoose = require("mongoose");
const sharednoterouter = express.Router();
const Note = require("../models/notes");
const User = require("../models/user");

// get all shared notes of a loggedin user
sharednoterouter.get("/getallsharednotes", async (req, res) => {
    try {
        const user = req.user;
        const notes = await User.findOne({ _id: user.id }).populate("sharedNotes","title content htmlcontent").select("-password -notesaccessto -friends");
        res.status(200).json({ notes: notes ? notes : [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
module.exports = sharednoterouter;