import * as bookService from "../services/books";
import request from "supertest";
import { app } from "../app";
import { Book } from "../models/book";

jest.mock("../services/books");

const dummyBookData = [
	{
		bookId: 1,
		title: "The Hobbit",
		author: "J. R. R. Tolkien",
		description: "Someone finds a nice piece of jewellery while on holiday.",
	},
	{
		bookId: 2,
		title: "The Shop Before Life",
		author: "Neil Hughes",
		description:
			"Before being born, each person must visit the magical Shop Before Life, where they choose what kind of person they will become down on Earth...",
	},
];

afterEach(() => {
	jest.clearAllMocks();
});

describe("GET /api/v1/books endpoint", () => {
	test("status code successfully 200", async () => {
		// Act
		const res = await request(app).get("/api/v1/books");

		// Assert
		expect(res.statusCode).toEqual(200);
	});

	test("books successfully returned as empty array when no data", async () => {
		// Arrange
		jest.spyOn(bookService, "getBooks").mockResolvedValue([]);
		// Act
		const res = await request(app).get("/api/v1/books");

		// Assert
		expect(res.body).toEqual([]);
		expect(res.body.length).toEqual(0);
	});

	test("books successfully returned as array of books", async () => {
		// Arrange

		// NB the cast to `Book[]` takes care of all the missing properties added by sequelize
		//    such as createdDate etc, that we don't care about for the purposes of this test
		jest
			.spyOn(bookService, "getBooks")
			.mockResolvedValue(dummyBookData as Book[]);

		// Act
		const res = await request(app).get("/api/v1/books");

		// Assert
		expect(res.body).toEqual(dummyBookData);
		expect(res.body.length).toEqual(2);
	});
});

describe("GET /api/v1/books/{bookId} endpoint", () => {
	test("status code successfully 200 for a book that is found", async () => {
		// Arrange
		jest
			.spyOn(bookService, "getBook")
			.mockResolvedValue(dummyBookData[1] as Book);

		// Act
		const res = await request(app).get("/api/v1/books/2");

		// Assert
		expect(res.statusCode).toEqual(200);
	});

	test("status code successfully 404 for a book that is not found", async () => {
		// Arrange

		jest.spyOn(bookService, "getBook").mockImplementation(() => {
			throw new Error("No book found with ID: 77");
		});

		// Act
		const res = await request(app).get("/api/v1/books/77");

		// Assert
		expect(res.statusCode).toEqual(404);
		expect(res.body).toEqual({ message: "No book found with ID: 77" });
	});

	test("controller successfully returns book object as JSON", async () => {
		// Arrange
		jest
			.spyOn(bookService, "getBook")
			.mockResolvedValue(dummyBookData[1] as Book);

		// Act
		const res = await request(app).get("/api/v1/books/2");

		// Assert
		expect(res.body).toEqual(dummyBookData[1]);
	});
});

describe("POST /api/v1/books endpoint", () => {
	test("status code successfully 201 for saving a valid book", async () => {
		// Arrange
		const bookToBeSaved = new Book({
			bookId: 3,
			title: "Fantastic Mr. Fox",
			author: "Roald Dahl",
			description: "A fox is fantastic",
		});

		jest
			.spyOn(bookService, "saveBook")
			.mockResolvedValue(Promise.resolve(bookToBeSaved));

		// Act
		const res = await request(app).post("/api/v1/books").send({
			bookId: 3,
			title: "Fantastic Mr. Fox",
			author: "Roald Dahl",
			description: "A fox is fantastic",
		});

		// Assert
		expect(res.statusCode).toEqual(201);
		expect(res.body).toEqual(bookToBeSaved.toJSON());
		expect(jest.spyOn(bookService, "saveBook")).toHaveBeenCalledTimes(1);
	});

	test("status code 400 when saving book with ID that already exists", async () => {
		// Arrange
		jest.spyOn(bookService, "saveBook").mockImplementation(() => {
			throw new Error("Book ID already exists");
		});

		// Act
		const res = await request(app).post("/api/v1/books").send({
			bookId: 1,
			title: "Fantastic Mr. Fox",
			author: "Roald Dahl",
			description: "A fox is fantastic",
		});

		// Assert
		expect(res.statusCode).toEqual(400);
		expect(res.body).toEqual({ message: "Book ID already exists" });
		expect(jest.spyOn(bookService, "saveBook")).toHaveBeenCalledTimes(1);
	});
});

describe("DELETE /api/v1/books/{bookId} endpoint", () => {
	test("status code 204 for successfully deleting a book", async () => {
		// Arrange
		jest.spyOn(bookService, "deleteBook").mockResolvedValue(Promise.resolve(1));

		// Act
		const res = await request(app).delete("/api/v1/books/2");

		// Assert
		expect(res.statusCode).toEqual(204);
		expect(jest.spyOn(bookService, "deleteBook")).toHaveBeenCalledWith(2);
		expect(jest.spyOn(bookService, "deleteBook")).toHaveBeenCalledTimes(1);
	});

	test("status code 404 for deleting a book that doesn't exist", async () => {
		// Arrange
		const bookID = "12";
		jest.spyOn(bookService, "deleteBook").mockImplementation(() => {
			throw new Error(
				`Unable to delete book ID:${bookID} as it does not exist.`
			);
		});

		// Act
		const res = await request(app).delete(`/api/v1/books/${bookID}`);

		// Assert
		expect(res.statusCode).toEqual(404);
		expect(res.body).toEqual({
			message: `Unable to delete book ID:${bookID} as it does not exist.`,
		});
		expect(jest.spyOn(bookService, "deleteBook")).toHaveBeenCalledWith(12);
		expect(jest.spyOn(bookService, "deleteBook")).toHaveBeenCalledTimes(1);
	});
});

describe("PUT /api/v1/books/{bookId} endpoint", () => {
	test("status code 204 for successfully updating a book", async () => {
		// Arrange
		const bookToUpdate = {
			bookId: 1,
			title: "The Hobbit",
			author: "J. R. R. Tolkien",
			description:
				"Fantasy tale about succumbing to peer pressure and biting off more than you can chew.",
		};

		jest
			.spyOn(bookService, "updateBook")
			.mockResolvedValue(Promise.resolve([1]));

		// Act
		const res = await request(app).put("/api/v1/books/1").send(bookToUpdate);

		// Assert
		expect(res.statusCode).toEqual(204);
		expect(jest.spyOn(bookService, "updateBook")).toHaveBeenCalledWith(
			1,
			bookToUpdate
		);
		expect(jest.spyOn(bookService, "updateBook")).toHaveBeenCalledTimes(1);
	});

	test("status code 404 for updating a book that doesn't exist", async () => {
		// Arrange
		const bookToUpdate = {
			bookId: 7,
			title: "The Hobbit",
			author: "J. R. R. Tolkien",
			description:
				"Fantasy tale about succumbing to peer pressure and biting off more than you can chew.",
		};
		jest.spyOn(bookService, "updateBook").mockImplementation(() => {
			throw new Error(
				`Unable to update book ID:${bookToUpdate.bookId} as it does not exist.`
			);
		});

		// Act
		const res = await request(app).put("/api/v1/books/7").send(bookToUpdate);

		// Assert
		expect(res.statusCode).toEqual(404);
		expect(res.body).toEqual({
			message: `Unable to update book ID:${bookToUpdate.bookId} as it does not exist.`,
		});
		expect(jest.spyOn(bookService, "updateBook")).toHaveBeenCalledWith(
			7,
			bookToUpdate
		);
		expect(jest.spyOn(bookService, "updateBook")).toHaveBeenCalledTimes(1);
	});
});
