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
        const books = await Book.find({});
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

app.get("/users", async (req, res) => {
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

/*
app.post("/checkout", async (req, res) => {
    try {
        const { book, borrower } = req.body;

        let borrowedBookObject = {
            "book": book,
            "borrower": borrower,
            "checkedOutDate": 
        } 


        const newBorrowedBook = await BorrowedBook.create(req.body);
        return res.status(500).json({ newBorrowedBook });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});
*/

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