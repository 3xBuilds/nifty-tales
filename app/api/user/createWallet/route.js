import User from "@/schemas/userSchema";
import { connectToDB } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try{
        const body = await req.json();
        
        const {wallet, username } = body;
        
        await connectToDB();
        
        const user = await User.findOne({
            username
        });

        if(userNameExists != null){
            user.wallet = wallet;
            await user.save();

            return new NextResponse(JSON.stringify({
                user
            }), { status: 200 });
        }

        else{
            return new NextResponse(JSON(
                "User not found!"
            ), { status: 404 });
        }

    }
    catch (error) {
        return new NextResponse(JSON.stringify(error), {
            status: 500,
        });
    }
}