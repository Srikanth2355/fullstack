const connectDB = require("../Config/db");
const mongoose = require("mongoose");
const Note = require("../models/notes");
const dotenv = require("dotenv");

// ✅ Load environment variables first
dotenv.config();

const createIndex = async () => {
    try {
        await connectDB(); // ✅ Ensure DB is connected 

        // ✅ Create index on 'sharedWith' field in 'Notes' collection
        await Note.collection.createIndex({ sharedWith: 1 });

        console.log("✅ Index created successfully!");
    } catch (error) {
        console.error("❌ Error creating index:", error);
    } finally {
        // ✅ Close database connection
        mongoose.connection.close();
    }
};

createIndex();