import Book from "@/schemas/bookSchema";
import { connectToDB } from "@/utils/db";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req: any) {
    try {
        await connectToDB();
        const url = new URL(req.url);
        const searchString = url.searchParams.get('query');

        if (!searchString) {
            return new NextResponse(JSON.stringify({ error: "Search query is required" }), { status: 400 });
        }

        const result = await Book.find({ name: { $regex: searchString, $options: 'i' } }).populate("author");

        const slicedResult = result?.slice(0, 2) || [];

        console.log(slicedResult);

        const session = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET
        });
    
        if (!session) {
            return new NextResponse(JSON.stringify({ history: null, result: slicedResult}), { status: 200 });
        }

        return new NextResponse(JSON.stringify({ result: slicedResult}), { status: 200 });
    } catch (error) {
        console.error("Error in GET request:", error);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}