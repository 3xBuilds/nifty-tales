import User from "@/schemas/userSchema";
import { connectToDB } from "@/utils/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req : any) {

    revalidatePath('/', 'layout') 

    try{
        const email = req.nextUrl.pathname.split("/")[3];

        await connectToDB();

        // await new Promise(resolve => setTimeout(resolve, 1000));

        const user = await User.findOne({email: email}).populate("yourBooks").populate("readlist").populate("mintedBooks");
        
        if (!user) {
            // console.log(`User not found for email: ${email}`);
            return NextResponse.json({message: "User not found!"}, {status : 404});
        }
        const user2 = await User.findOne({email: email});

        return new NextResponse(JSON.stringify({
            user, unPopulated:user2
        }), { status: 200 });
    }
    catch (error) {
        return new NextResponse(JSON.stringify(error), {
            status: 500,
        });
    }
}

export async function PATCH(req:any){
    revalidatePath('/', 'layout') 

    try{
        const body = await req.json();

        const {...rest} = body;
        const email = req.nextUrl.pathname.split("/")[3];

        await connectToDB();
        const updatedUser = await User.findOneAndUpdate(
            { email: email },  // find the user by email
            { $set: body },    // update with all fields from the body
            { new: true, runValidators: true }  // options: return updated doc and run schema validators
        );


        return new NextResponse(JSON.stringify({
            updatedUser
        }), { status: 200 });
    }
    catch (error) {
        return new NextResponse(JSON.stringify(error), {
            status: 500,
        });
    }
}