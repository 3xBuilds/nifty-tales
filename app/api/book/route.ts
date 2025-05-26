import Book from "@/schemas/bookSchema"
import { connectToDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache";
import User from "@/schemas/userSchema";


type BookType = {
    name: string;
    isPublished?: boolean;
    price?: number;
    maxMint?: number;
    cover?: string | null;
    author: Object | null;
    artist?: string | null;
    ISBN?: string | null;
    description?: string | null;
    tags?: string[];
    pdf: string;
    readers?: number;
    isBoosted?: string | null;
    createdAt?: Date;
}

// get all books route
export async function GET(req: NextRequest) {
    revalidatePath('/', 'layout') 

    try {
        await connectToDB();
        let books: BookType[] = await Book.find();

        // const res = books.map(async(book: BookType) => {
        //     return {
        //         ...book, 
        //         author: await User.findById(book.author, 'name username profileImage') // Fetch author details
        //     }
        // });

        // const response = await Promise.all(res);
        // books = response.filter(book => book.author !== null); // Filter out books without authors

        if (books.length === 0) {
            return NextResponse.json({
                data: [],
                message: "No books found"
            }, { status: 404 })
        }

        return NextResponse.json({
            data: books
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong"
        }, { status: 500 })
    }

}