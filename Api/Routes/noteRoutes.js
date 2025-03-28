const express = require("express");
const mongoose = require("mongoose");
const noterouter = express.Router();
const Note = require("../models/notes");
const User = require("../models/user");
const { checkvalidfriends, checkalrdyshared, checkshared } = require("../Middlewares/friends");

noterouter.post("/addnote", async (req, res) => {
    try {
        const note_data = req.body;
        const note = new Note();
        note.title = note_data.title;
        note.content = note_data.content;
        note.htmlcontent = note_data.htmlcontent;
        note.createdBy = req.user.id;
        await note.save();
        res.status(200).json({ message: "Note added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

noterouter.get("/getallnotes", async (req, res) => {
    try {
        const notes = await Note.find({ createdBy: req.user.id }).select('-sharedWith').sort({ createdAt: -1 }); // Get notes created by the logged in user
        res.status(200).json({ notes: notes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

noterouter.post("/updatenote", async (req, res) => {
    try{
        const note_data = req.body;
        const userid = req.user.id;
        const findnote = await Note.findOne({ _id: note_data.id, createdBy: userid });
        if (!findnote) {
            return res.status(400).json({ error: "Note not found" });
        }
        findnote.title = note_data.title;
        findnote.content = note_data.content;
        findnote.htmlcontent = note_data.htmlcontent;
        await findnote.save();
        res.status(200).json({ message: "Note updated successfully" });
    }catch(error){
        res.status(500).json({ error: error.message }); 
    }
});

noterouter.post("/deletenote", async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const note_data = req.body;
        const userid = req.user.id;
        const findnote = await Note.findOne({ _id: note_data.id, createdBy: userid });
        if (!findnote) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: "Note not found" });
        }

        const sharedWithUsers = findnote.sharedWith;
        if(sharedWithUsers.length > 0){
           await User.updateMany(
                { _id: { $in: sharedWithUsers } }, // Match users whose IDs are in friendIds array
                { $pull: { notesaccessto: note_data.id } }, // Remove noteId from notesaccessto array
                { session }
            );
        }

        // also remove from created user sharednotes array with session
        const user = await User.findOne({ _id: userid });
        user.sharedNotes.pull(note_data.id);
        await user.save({ session });

        // Delete the note
        await Note.findByIdAndDelete(note_data.id, { session });
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: "Note deleted successfully" });
    }catch(error){
         // Rollback transaction if any step fails
         await session.abortTransaction();
         session.endSession();
        res.status(500).json({ error: error.message }); 
    }
});

noterouter.get("/getnote/:id", async (req, res) => {
    try{
        const userid = req.user.id;
        // , createdBy: userid
        const findnote = await Note.findOne({ _id: req.params.id });
        if (!findnote) {
            return res.status(400).json({ message: "Note not found" });
        }
        if(findnote.createdBy != userid){
            return res.status(400).json({ message: "Access denied to this note. Plesae contact the owner to get access" });
        }
        res.status(200).json({ note: findnote });
    }catch(error){
        res.status(500).json({ error: error.message }); 
    }
})

// get freiends who has access to this notes 
noterouter.get("/getfrndsaccesstonotes/:id",async(req,res)=>{
    try{
        const user = req.user;
        const noteid = req.params.id;
        // first check whether note id exists and created by loggedin user iteself
        const note = await Note.findOne({ _id: noteid });
        if(!note){
            return res.status(400).json({ message: "Note not found" });
        }
        if(note.createdBy != user.id){
            return res.status(400).json({ message: "Access denied to this note. Plesae contact the owner to get access" });
        }
        // now get all friends who have access to this note
        const friends = await Note.find({ _id: noteid }).populate('sharedWith',"email name").select('sharedWith');
        res.status(200).json({ friends: friends?friends[0].sharedWith:[] });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

// implement share note with friends
noterouter.post("/sharenotes/:id",checkvalidfriends,checkalrdyshared,async(req,res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const noteid = req.params.id;
        const friendIds = req.friendIds; //added this to request in checkvalidfriends middleware
        const note = await Note.findOne({ _id: noteid });
        note.sharedWith.push(...friendIds);
        await note.save({ session });
        const result = await User.updateMany(
            { _id: { $in: friendIds } }, // Match users whose IDs are in friendIds array
            { $addToSet: { notesaccessto: noteid } }, // Add noteId without duplicates
            { session }
          );
        // Also updte the user document sharednotes array
        const user = await User.updateOne(
            { _id: req.user.id },
            { $addToSet: { sharedNotes: noteid } }, // Prevents duplicates
            { session }
        );
        // Commit transaction if all updates succeed
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: "Note shared successfully" });
    }catch(error){
        // Rollback transaction if any update fails
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
})

// implement unshare note with friends
noterouter.delete("/removeaccess/:id/:friendid",checkshared,async(req,res)=>{
    try{
        const noteid = req.params.id;
        const friendid = req.params.friendid;
        const note = await Note.findOne({ _id: noteid });
        note.sharedWith.pull(friendid);
        await note.save();
        // Also updte the user document sharednotes array
        if(note.sharedWith.length == 0){
            const user = await User.findOne({ _id: req.user.id });
            user.sharedNotes.pull(noteid);
            await user.save();
        }

        // Also updte the user document notesaccessto array
        const frd_user = await User.findOne({ _id: friendid });
        frd_user.notesaccessto.pull(noteid);
        await frd_user.save();
        res.status(200).json({ message: "Access removed successfully" });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

module.exports = noterouter;