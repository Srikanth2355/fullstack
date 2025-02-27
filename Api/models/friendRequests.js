const mongoose = require("mongoose");

const friendRequestSchema = new mongoose.Schema({
    senderemail: {
        type: String,
        required: true
    },
    receiveremail: {
        type: String,
        required: true
    },
    sendername: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

module.exports = FriendRequest;