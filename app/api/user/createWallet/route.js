import User from "@/schemas/userSchema";
import { connectToDB } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try{
        const body = await req.json();
        
        const {wallet, username, ...rest } = body;
        
        await connectToDB();
        
        const userNameExists = await User.findOne({
            username
        });

        if(userNameExists != null){
            return new NextResponse(JSON.stringify({success: false, error: "Username or wallet already exists"}), { status: 409 });
        }

        const user = await User.create({
                wallet,
                username,
                ...rest
            }
        )
        return new NextResponse(JSON.stringify({
            user
        }), { status: 200 });
    }
    catch (error) {
        return new NextResponse(JSON.stringify(error), {
            status: 500,
        });
    }
}