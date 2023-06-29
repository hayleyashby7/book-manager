import express from "express";
import * as booksController from "../controllers/books_controller";

export const router = express.Router();
// get books
router.get("/books", booksController.getBooks);
router.get("/books/:bookId", booksController.getBook);

// add books
router.post("/books", booksController.saveBook);

// update books
router.put("/books/:bookId", booksController.updateBook);

// delete books
router.delete("/books/:bookId", booksController.deleteBook);
