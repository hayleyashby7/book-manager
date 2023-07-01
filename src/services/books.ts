import e from "express";
import { Book } from "../models/book";

export const getBooks = async () => {
	return Book.findAll();
};

export const getBook = async (bookId: number) => {
	const book = await Book.findOne({
		where: { bookId },
	});

	if (!book) {
		throw new Error(`No book found with ID: ${bookId}`);
	} else return book;
};

export const saveBook = async (book: Book) => {
	await preSaveChecks(book);
	return Book.create<Book>(book);
};

export const updateBook = async (bookId: number, book: Book) => {
	return Book.update(book, {
		where: {
			bookId,
		},
	});
};

export const deleteBook = async (bookId: number) => {
	const result = await Book.destroy({
		where: {
			bookId,
		},
	});

	if (result === 0) {
		throw new Error(`Unable to delete book ID:${bookId} as it does not exist.`);
	} else return result;
};

const preSaveChecks = async (book: any) => {
	const bookExists = await getBook(book.bookId);

	if (bookExists) {
		throw new Error("Book ID already exists");
	}
};
