import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getToken } from "next-auth/jwt";
import { connectToDB } from "@/utils/db";
import {
 DeleteObjectCommand
} from "@aws-sdk/client-s3";

import Book from "@/schemas/bookSchema";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
  }
});



async function uploadFileToS3(content, wallet, date) {
  try {
    if (!content) {
      console.error("No content provided for upload");
      return false;
    }

    console.log("Content type:", typeof content);
    console.log("Content length:", content.byteLength);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `users/${wallet}/content/${date}/audio`,
      Body: Buffer.from(content),
      ContentType: "audio/mpeg"
    };

    console.log("S3 upload params:", {
      Bucket: params.Bucket,
      Key: params.Key,
      ContentType: params.ContentType,
      BodyLength: params.Body.length
    });

    const command = new PutObjectCommand(params);

    console.log("Sending S3 command...");
    const result = await s3Client.send(command);
    console.log("S3 upload result:", result);

    return true;
  } catch (e) {
    console.error("Error in uploadFileToS3:");
    console.error(e);
    if (e.name === 'CredentialsProviderError') {
      console.error("AWS credentials are invalid or not properly configured");
    } else if (e.$metadata) {
      console.error("AWS S3 error metadata:", e.$metadata);
    }
    return false;
  }
}

async function deleteFileFromS3(key){
  try{
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const data = await s3Client.send(new DeleteObjectCommand({Bucket:bucketName, Key:key}));
    if(data){
      console.log("____----____----____----____----");
      console.log("____----____----____----____----");
      console.log("____----____----____----____----");
      console.log("Success. Object deleted.", data);
      console.log("____----____----____----____----");
      console.log("____----____----____----____----");
      console.log("____----____----____----____----");
      return true;
    }
    else{
      return false;
    }
  }
  catch(err){
    console.log(err);
  }
}

export async function POST(req) {
  const session = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role == "ANONYMOUS") {
    return NextResponse.json({ error: "This action cannot be performed as a guest." }, { status: 501 })
  }

  try {
    const formData = await req.formData();
    await connectToDB();

    const audio = formData.get('audio');
    const wallet = formData.get("wallet");
    const id = formData.get('bookId')
    const date = Date.now();

    if (!audio) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const contentArrayBuffer = await audio.arrayBuffer();

    const status = await uploadFileToS3(contentArrayBuffer, wallet, date);

    if (status) {
      const book =await Book.findById(id);
      console.log(book);
      if(book?.audiobook !== ""){
        const key = `users/${wallet}/content/${book?.audiobook?.split("/")[6]}/audio`
        await deleteFileFromS3(key);
      }

      book.audiobook = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${wallet}/content/${date}/audio`;
      await book.save();
      return NextResponse.json({ res: true }, { status: 200 })
    } else {
      return NextResponse.json({ res: "Upload failed" }, { status: 500 })
    }

  } catch (err) {
    console.error("Error in POST handler:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
