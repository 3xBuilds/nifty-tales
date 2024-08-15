import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/db";
import User from "@/schemas/userSchema";
import Book from "@/schemas/bookSchema";

export async function POST(req:any){
    try{
        await connectToDB()
        const body = await req.json();
        const{email, bookId} = body;

        const user: UserType | null = await User.findOne({email: email});
        if(user?.readlist.includes(bookId)){
            return new NextResponse(JSON.stringify("Book already in readlist"), {
                status: 401,
            });
        }

        else{
            const book: BookType | null = await Book.findById({_id: bookId});

            //@ts-ignore
            book?.readers += 1;
            //@ts-ignore
            await book?.save();
            user?.readlist.push(bookId);
            //@ts-ignore
            await user?.save();
            return new NextResponse(JSON.stringify({
                book: book,
                user:user
            }), { status: 200 });
        }
    }
    catch(err){
        console.log(err);
    }
}