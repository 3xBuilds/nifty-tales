import User from "@/schemas/userSchema";
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

        const result1 = await User.find({ username: { $regex: searchString, $options: 'i' } }).populate('yourBooks');

        const slicedResult1 = result1?.slice(0, 3) || [];

        const session = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET
        });
    
        if (!session) {
            return new NextResponse(JSON.stringify({ history: null, result: slicedResult1}), { status: 200 });
        }

        const user = await User.findOne({ email: session.email });

        const history = user.searchHistory?.reverse().slice(0, 5) || [];

        return new NextResponse(JSON.stringify({result: slicedResult1}), { status: 200 });
    } catch (error) {
        console.error("Error in GET request:", error);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}