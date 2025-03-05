const User = require("../models/user");
const Note = require("../models/notes"); 
const checkvalidfriends = async (req, res, next) => {
    try{
        const user = req.user;
        const friendsdata = req.body.friends;
        if(!friendsdata || friendsdata.length == 0){
            return res.status(400).json({ message: "Please select friends to share this note" });
        }
        if(friendsdata.length >5){
            return res.status(400).json({ message: "You can share this note with maximum 5 friends ata at a time" });
        }
        const friendIds = friendsdata.map(friend => friend._id); // Extract _id values
        const result = await User.findOne({
          _id: user.id,
          friends: { $all: friendIds } // Check if all friendIds exist in friends array
        });
        if(result){
            req.friendIds = friendIds;
            next();
        }else{
            return res.status(400).json({ message: "Please select valid friends to share this note" });
        }
    }catch (error) {
        console.error("Error checking friends:", error);
        return res.status(500).json({ message: error.message });
    }

}

const checkalrdyshared = async (req, res, next) => {
    try{
        const user = req.user;
        const noteid = req.params.id;
        const friendids = req.friendIds; 
        // first check whether note id exists and created by loggedin user iteself
        const note = await Note.findOne({ _id: noteid });
        if(!note){
            return res.status(400).json({ message: "Note not found" });
        }
        if(note.createdBy != user.id){
            return res.status(400).json({ message: "Access denied to this note. Plesae contact the owner to get access" });
        }
        
        // now check whether this note is already shared with this user
        const isShared = await Note.findOne({ _id: noteid });
        const sharedWithIds = new Set(isShared.sharedWith.map(friend => friend._id));
        const result = friendids.some(friendId => sharedWithIds.has(friendId));
        if(result){
            return res.status(400).json({ message: "This note is already shared with users. Try unselecting them" });
        }
        next();
    }
    catch (error) {
        console.error("Error checking friends:", error);
        return res.status(500).json({ message: error.message });
    }

}

const checkshared = async (req, res, next) => {
    try{
        const user = req.user;
        const noteid = req.params.id;
        const friendid = req.params.friendid; 
        // first check whether note id exists and created by loggedin user iteself
        const note = await Note.findOne({ _id: noteid });
        if(!note){
            return res.status(400).json({ message: "Note not found" });
        }
        if(note.createdBy != user.id){
            return res.status(400).json({ message: "Access denied to this note. Plesae contact the owner to get access" });
        }
        // now check whether this note is already shared with this user
        const isShared = await Note.findOne({ _id: noteid,sharedWith:{$in:friendid}});
        if(!isShared){
            return res.status(400).json({ message: "This note is not shared with this user" });
        }
        next();
    }
    catch (error) {
        console.error("Error checking Notes access to user:", error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {checkvalidfriends,checkalrdyshared,checkshared};