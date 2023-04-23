const express = require("express");
const app = express();

const connectDB = require("./connect");
require("dotenv").config();
const path = require("path");

const Book = require("./book");
const User = require("./user");
const BorrowedBook = require("./borrowedbook");

app.use(express.json());

app.get("/", async (req, res) => {
    try {
        return res.sendFile(path.join(__dirname, "/frontend/books.html"));
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});

app.get("/getbooks", async (req, res) => {
    try {
        const books = await Book.aggregate([
            { $lookup:
                {
                    from: "borrowedbooks",
                    localField: "_id",
                    foreignField: "book",
                    as: "loans"
                }
            }
        ]);
        return res.status(200).json({ books });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});

app.get("/addbook", async (req, res) => {
    try {
        return res.sendFile(path.join(__dirname, "/frontend/addbook.html"));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});

app.post("/addbook", async (req, res) => {
    try {
        const newBook = await Book.create(req.body);
        return res.status(201).json({ newBook });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});

app.get("/getusers", async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json({ users });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});

app.post("/adduser", async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        return res.status(201).json({ newUser });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});

app.post("/checkout", async (req, res) => {
    try {
        const book = req.body.book;
        const validateBook = await BorrowedBook.find({ _id: book });

        if (validateBook.length > 0) {
            return res.status(400).json({ error: "Cannot checkout this book since it is already checked out"});
        }

        const borrower = req.body.borrower;

        let today = new Date();
        today = new Date(
            today.toLocaleString('en-US', {
                timeZone: 'America/Chicago'
            })
        );
        
        let twoWeeksFromToday = new Date();
        twoWeeksFromToday = new Date(
            twoWeeksFromToday.toLocaleString('en-US', {
                timeZone: 'America/Chicago'
            })
        );
        twoWeeksFromToday.setDate(twoWeeksFromToday.getDate() + 14);

        const newLoanObject = {
            book: book,
            borrower: borrower,
            checkedOutDate: today,
            dueDate: twoWeeksFromToday
        }

        const createdLoan = await BorrowedBook.create(newLoanObject);
        const newBookLoan = await BorrowedBook.findOne({ _id: createdLoan._id }).populate("book").populate("borrower");
        
        return res.status(201).json({ newBookLoan });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});

app.delete("/checkin/:id", async (req, res) => {
    try {
        const bookLoanID = req.params.id;
        const checkedInBook = await BorrowedBook.findOneAndDelete({ _id: bookLoanID }).populate("book").populate("borrower");
        return res.status(200).json({ checkedInBook });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ error });
    }
});

app.get("/bookloans", async (req, res) => {
    try {
        return res.sendFile(path.join(__dirname, "/frontend/bookloans.html"));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});

app.get("/getbookloans", async (req, res) => {
    try {
        const bookLoans = await BorrowedBook.find({}).populate("book").populate("borrower");
        return res.status(200).json({ bookLoans });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});

const port = process.env.PORT || 3000;

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server listening on Port ${port}`);
        });
    }
    catch (error) {
        console.log(error);
    }
}

start();