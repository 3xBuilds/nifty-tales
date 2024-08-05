import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    }
});

async function uploadFileToS3 (cover, content, name, description, tokenId, wallet) {

    try{
        // Upload Cover
        const coverParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `users/${wallet}/metadata/${tokenId}/content/cover`,
            Body: cover,
            ContentType: "image/png"
        }

        const coverCommand = new PutObjectCommand(coverParams);
        await s3Client.send(coverCommand);

        // Upload Content
        const contentParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `users/${wallet}/metadata/${tokenId}/content/book`,
            Body: content,
            ContentType: "application/pdf"
        }

        const contentCommand = new PutObjectCommand(contentParams);
        await s3Client.send(contentCommand);

        // Create a json file with metadata
        const metadata = {
            name,
            description,
            tokenId,
            cover: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${wallet}/metadata/${tokenId}/content/cover`,
            content: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${wallet}/metadata/${tokenId}/content/book`
        }

        const metadataParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `users/${wallet}/metadata/${tokenId}`,
            Body: JSON.stringify(metadata),
            ContentType: "application/json"
        }

        const metadataCommand = new PutObjectCommand(metadataParams);
        await s3Client.send(metadataCommand);

        return true;
    }
    catch(e){
        console.log(e);
        return false;
    }
}


export async function POST(request) {

    try{
        const formData = await request.formData();
        const cover = formData.get('cover');
        const content = formData.get('content');
        const name = formData.get('name');
        const description = formData.get('description');
        const tokenId = formData.get('tokenId');
        const wallet = formData.get('wallet');

        if(!cover){
            return NextResponse.json({error: "File is required."}, {status: 400})
        }
        if(!content){
            return NextResponse.json({error: "File is required."}, {status: 400})
        }
        if(!name){
            return NextResponse.json({error: "File is required."}, {status: 400})
        }
        if(!description){
            return NextResponse.json({error: "File is required."}, {status: 400})
        }
        if(!tokenId){
            return NextResponse.json({error: "File is required."}, {status: 400})
        }
        if(!wallet){
            return NextResponse.json({error: "File is required."}, {status: 400})
        }

        const coverBuffer = Buffer.from(await cover.arrayBuffer());
        const contentBuffer = Buffer.from(await content.arrayBuffer());

        const status = await uploadFileToS3(coverBuffer, contentBuffer, name, description, tokenId, wallet);

        return NextResponse.json({success: status});
    }
    catch(e){
        return NextResponse.json({error: "Error Uploading File"})
    }
}