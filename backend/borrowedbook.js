const mongoose = require("mongoose");

const BorrowedBookSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: [true, "Please provide a book"]
    },
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide a borrower"]
    },
    checkedOutDate: {
        type: Date,
        required: [true, "Please provide a check out date"]
    },
    dueDate: {
        type: Date,
        required: [true, "Please provide a due date"]
    }
});

module.exports = mongoose.model("BorrowedBook", BorrowedBookSchema);