import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    }
});


async function uploadFileToS3 (file, wallet) {
    const fileBuffer = file;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `users/${wallet}/info/profileImage`,
        Body: fileBuffer,
        ContentType: "image/png"
    }

    try{
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        return true;
    }
    catch(e){
        console.log(e);
        return false
    }
    
}


export async function POST(request) {

    try{
        const formData = await request.formData();
        const profileImage = formData.get('profileImage');
        const wallet = formData.get('wallet');

        if(!profileImage){
            return NextResponse.json({error: "File is required."}, {status: 400})
        }
        if(!wallet){
            return NextResponse.json({error: "File is required."}, {status: 400})
        }

        const buffer = Buffer.from(await profileImage.arrayBuffer());
        const status = await uploadFileToS3(buffer, wallet);

        return NextResponse.json({success: status});
    }
    catch(e){
        return NextResponse.json({error: "Error Uploading File"})
    }
}
