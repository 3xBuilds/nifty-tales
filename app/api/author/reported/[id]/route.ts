import { NextResponse } from "next/server";
import BookReports from "@/schemas/bookReportSchema";
import Book from "@/schemas/bookSchema";
import User from "@/schemas/userSchema";
import { revalidatePath } from "next/cache";
import { connectToDB } from "@/utils/db";

export async function GET(req:any){
    revalidatePath("/", "layout");
    try{
        const email = req.nextUrl.pathname.split("/")[4];

        await connectToDB();

        const user = await User.findOne({email: email});

        if(!user){
            return NextResponse.json({error: "User not found"},{status:404});
        }

        const books = await Book.find({author: user._id});

        if(books.length == 0){
            return NextResponse.json({error: "No reported books"}, {status:404});
        }

        const arr:any = []

        await Promise.all(books.map(async(item:BookType)=>{
            const reports = await BookReports.find({book: item._id});

            if(reports.length > 0){
                const name = item.name;
                const status = item.isAdminRemoved;
                const reportNum = reports.length;
                arr.push({name, status, reportNum});
            }
            return ;
        }))

        return NextResponse.json({array:arr}, {status:200});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({error: err}, {status:500})
    }
}