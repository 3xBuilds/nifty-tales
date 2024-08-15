import Book from "@/schemas/bookSchema"
import { connectToDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache";
import User from "@/schemas/userSchema";



export async function GET(req: NextRequest) {

    try {
        revalidatePath('/', 'layout') 

        const id = req.nextUrl.pathname.split("/")[3];

        console.log(id);

        await connectToDB();
        const book: BookType | null = await Book.findById(id);

        const user: UserType | null = await User.findById({_id: book?.author});

        console.log(book, user);

        if (!book) {
            return NextResponse.json({
                data: "",
                message: "Book not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            data: book,
            user: user
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong"
        }, { status: 500 })
    }

}

export async function PATCH(req:any){
    try {
        revalidatePath('/', 'layout') 

        const id = req.nextUrl.pathname.split("/")[3];

        console.log(id);
        const body = await req.json()

        await connectToDB();
        const {...rest} = body;


        const updatedBook = await Book.findByIdAndUpdate(
            { _id: id }, 
            { $set: body }, 
            { new: true, runValidators: true } 
        );

        console.log(updatedBook);

        return NextResponse.json({
            data: updatedBook
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong"
        }, { status: 500 })
    }
}