const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"]
    },
    authorFirstName: {
        type: String,
        required: [true, "Please provide the author's first name"]
    },
    authorLastName: {
        type: String,
        required: [true, "Please provide the author's last name"]
    }
});

module.exports = mongoose.model("Book", BookSchema);