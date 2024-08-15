import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/db";
import User from "@/schemas/userSchema";
import Book from "@/schemas/bookSchema";

export async function POST(req: any) {
    try {
        await connectToDB();
        const body = await req.json();
        const { email, bookId } = body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.readlist.includes(bookId)) {
            return NextResponse.json({ message: "Book already in readlist" }, { status: 400 });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return NextResponse.json({ message: "Book not found" }, { status: 404 });
        }

        book.readers = (book.readers || 0) + 1;
        await book.save();

        user.readlist.push(bookId);
        await user.save();

        return NextResponse.json({
            message: "Book added to readlist successfully",
            book: book,
            user: user
        }, { status: 200 });
    } catch (err) {
        console.error("Error adding book to readlist:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}