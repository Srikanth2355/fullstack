const express = require("express");
const noterouter = express.Router();
const Note = require("../models/notes");

noterouter.post("/addnote", async (req, res) => {
    try {
        const note_data = req.body;
        const note = new Note();
        note.title = note_data.title;
        note.content = note_data.content;
        note.createdBy = req.user.id;
        await note.save();
        res.status(200).json({ message: "Note added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

noteRouter.get("/getnotes", async (req, res) => {
    try {
        const notes = await Note.find({ createdBy: req.user.id }).select('-sharedWith').sort({ createdAt: -1 }); // Get notes created by the logged in user
        res.status(200).json({ notes: notes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = noterouter;