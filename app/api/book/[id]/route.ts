import Book from "@/schemas/bookSchema"
import { connectToDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache";


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

    try {
        revalidatePath('/', 'layout') 

        const id = req.nextUrl.pathname.split("/")[3];

        console.log(id);

        await connectToDB();
        const book: BookType | null = await Book.findById(id);

        console.log(book);

        if (!book) {
            return NextResponse.json({
                data: "",
                message: "Book not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            data: book
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong"
        }, { status: 500 })
    }

}