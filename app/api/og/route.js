// Import required modules and constants
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { connectToDB } from "@/utils/db";
import Book from "@/schemas/bookSchema";

async function fetchBookData(bookId) {
  await connectToDB();
  const book = await Book.findById(bookId);
  console.log(book)
  if (!book) {
    throw new Error('Book not found');
  }
  return book;
}

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const bookId = searchParams.get("id");
    console.log("ID", bookId);
    if (!bookId) {
      throw new Error('Book ID is required');
    }

    const book = await fetchBookData(bookId);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap:"50px",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f0f0",
          }}
        >
          <img
            src={book.cover}
            alt={book.name}
            style={{ width: "500px", marginBottom: "20px", position:"relative", zIndex:50, borderRadius:"20px" }}
          />
          <div
            style={{
              fontSize: "70px",
              fontWeight: "bold",
              textAlign: "center",
              color: "#333",
            }}
          >
            {book.name}
          </div>
        </div>
      ),
      {
        width: 1920,
        height: 1080,
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f0f0f0",
            color: "#ff0000",
            fontSize: "32px",
          }}
        >
          Error generating image: {error.message}
        </div>
      ),
      {
        width: 1920,
        height: 1080,
      }
    );
  }
}