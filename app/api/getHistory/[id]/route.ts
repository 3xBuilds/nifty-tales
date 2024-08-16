import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";
import User from '@/schemas/userSchema';
import { connectToDB } from '@/utils/db';
import { revalidatePath } from 'next/cache';

export async function GET(req: any) {
    try {
        revalidatePath('/', 'layout') 

        const email = req.nextUrl.pathname.split("/")[3];

        await connectToDB();

        const user = await User.find({ email: email}).populate('searchHistory');

        // const session = await getToken({
        //     req,
        //     secret: process.env.NEXTAUTH_SECRET
        // });
    
        // if (!session) {
        //     return new NextResponse(JSON.stringify({ history: null, result: slicedResult}), { status: 200 });
        // }

        return new NextResponse(JSON.stringify({ user: user}), { status: 200 });
    } catch (error) {
        console.error("Error in GET request:", error);
        return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}