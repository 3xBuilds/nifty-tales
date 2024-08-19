import User from "@/schemas/userSchema";
import { connectToDB } from "@/utils/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req:any){
    revalidatePath('/', 'layout') 
    try{
        const wallet = req.nextUrl.pathname.split("/")[4];

        await connectToDB();

        const user = await User.findOne({wallet: wallet});

        if(user){
            return new NextResponse(JSON.stringify({
                message: "Wallet Exists"
            }), { status: 400 });
        }

        return new NextResponse(JSON.stringify({
            message: "Wallet is new"
        }), { status: 200 });

    }
    catch(err){
        console.log(err);
        return NextResponse.json({error: err}, {status:500});
    }
}