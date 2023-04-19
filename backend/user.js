const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please provide a first name"]
    },
    lastName: {
        type: String,
        required: [true, "Please provide a last name"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true
    },
    address: {
        type: String,
        required: [true, "Please provide an address"]
    },
    checkedOutBooks: [{type: mongoose.Schema.Types.ObjectId, ref: "BorrowedBook"}]
});

module.exports = mongoose.model("User", UserSchema);