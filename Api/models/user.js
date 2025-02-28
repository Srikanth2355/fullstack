const mongoose = require("mongoose"); 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "superadmin","visitor"]
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sharedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notes" }]
},
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;