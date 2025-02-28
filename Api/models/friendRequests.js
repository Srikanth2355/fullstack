const mongoose = require("mongoose");

// status flow
// pending -> accepted/rejected -> unfriend
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
    senderid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "unfriend"],
        default: "pending",
    }
},
    {
        timestamps: true
    });

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

module.exports = FriendRequest;