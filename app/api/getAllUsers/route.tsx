import { NextResponse } from "next/server";
import User from "@/schemas/userSchema";
import { connectToDB } from "@/utils/db";

export async function POST(req:any){
    try{
        await connectToDB();

        const body = await req.json();

        const {array} = body;

        console.log(array);

        
        const arr = await Promise.all(array.map(async(item:any)=>{
            const user = await User.findOne({wallet: item});
            return user.username;
        }))

        return NextResponse.json({arr: arr}, {status:200});
        
    }
    catch(err){
        return NextResponse.json({error: err}, {status:500})
    }
}