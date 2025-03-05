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

// getaccessnotes 
sharednoterouter.get("/getaccessnotes", async (req, res) => {
    try {
        const user = req.user;
        const notes = await User.findOne({ _id: user.id }).populate("notesaccessto","title content htmlcontent").select("-password -sharedNotes -friends");
        res.status(200).json({ notes: notes ? notes : [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// getaccessnote
sharednoterouter.get("/getaccessnote/:id", async (req, res) => {
    try {
        const noteid = req.params.id;
        const note = await Note.findOne({ _id: noteid,sharedWith: { $in: [req.user.id] } });
        if (!note) {
            return res.status(400).json({ message: "Note not found/ You do not have Access to this note" });
        }
        res.status(200).json({ note: note });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
module.exports = sharednoterouter;