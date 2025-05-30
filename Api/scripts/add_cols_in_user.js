const connectDB = require("../Config/db");
const mongoose = require("mongoose");
const User = require("../models/user");
const dotenv = require("dotenv");

// ✅ Load environment variables first
dotenv.config();

// ✅ Connect to MongoDB before running update
// function to add friends and sharedNotes columns
const updateExistingUsers = async () => {
  try {
    await connectDB(); // ✅ Ensure DB is connected

    // ✅ Update users only if 'friends' or 'sharedNotes' do not exist
    const result = await User.updateMany(
      { $or: [{ friends: { $exists: false } }, { sharedNotes: { $exists: false } }] },
      { $set: { friends: [], sharedNotes: [] } }
    );

    console.log(`✅ Updated ${result.modifiedCount} users successfully!`);
  } catch (error) {
    console.error("❌ Error updating users:", error);
  } finally {
    // ✅ Close database connection
    mongoose.connection.close();
  }
};
// updateExistingUsers();
// updateExistingNotes();

const addnotesaccesscolumn = async () => {
  try {
    await connectDB(); // ✅ Ensure DB is connected

    // ✅ Update users only if 'friends' or 'sharedNotes' do not exist
    const result = await User.updateMany(
      { $or: [{ notesaccessto: { $exists: false } }] },
      { $set: { notesaccessto: []} }
    );

    console.log(`✅ Updated ${result.modifiedCount} users successfully!`);
  } catch (error) {
    console.error("❌ Error updating users:", error);
  } finally {
    // ✅ Close database connection
    mongoose.connection.close();
  }
};

const deletenoteid = async () => {
  try {
    await connectDB();
    await User.findOneAndUpdate(
      { email: 'srikanth@gmail.com' }, 
      { $pull: { sharedNotes: '67c5823caeffb4142293dca2' } },
      { new: true } // Return the updated document
    );
    await User.findOneAndUpdate(
      { email: 'giri.uofm@gmail.com' }, 
      { $pull: { notesaccessto: '67c5823caeffb4142293dca2' } },
      { new: true } // Return the updated document
    );
  } catch (error) {
    console.error("❌ Error updating user:", error);
  } finally {
    // ✅ Close database connection
    mongoose.connection.close();
  }

}
// addnotesaccesscolumn();
// deletenoteid();
