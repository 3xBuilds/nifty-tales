import { NextResponse } from "next/server";

import Bookmarks from "@/schemas/bookmarkSchema"
import { connectToDB } from "@/utils/db";

export async function GET(req:any){
    try{
        await connectToDB();
        const id = req.nextUrl.pathname.split("/")[3];
        const bookmark = await Bookmarks.findOne({book: id});

        return NextResponse.json({data: bookmark}, {status:200});
    }
    catch(err){
        return NextResponse.json({message: err}, {status:500})
    }
}