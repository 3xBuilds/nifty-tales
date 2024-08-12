import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import Book from "@/schemas/bookSchema";
import { connectToDB } from "@/utils/db";
import User from "@/schemas/userSchema";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
  }
});

async function uploadFileToS3(cover, content, name, description, tokenId, objectId, wallet) {
  try {
    // Upload Cover
    const coverParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `users/${wallet}/content/${objectId}/cover`,
      Body: cover,
      ContentType: "image/png"
    }
    const coverCommand = new PutObjectCommand(coverParams);
    await s3Client.send(coverCommand);

    // Upload Content (PDF)
    const contentParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `users/${wallet}/content/${objectId}/book`,
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
      image: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${wallet}/content/${objectId}/cover`,
      content: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${wallet}/content/${objectId}/book`
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
  } catch(e) {
    console.error(e);
    return false;
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    connectToDB();
    
    const name = formData.get('name');
    const isbn = formData.get('isbn');
    const description = formData.get('description');
    const tags = formData.getAll('tags') || [];
    const artist = formData.get('artist');
    const contractAdd = formData.get('contractAdd');
    const cover = formData.get('cover');
    const content = formData.get('content');
    const price = formData.get('price') || 0;
    const maxMint = formData.get('maxMint') || 0;
    const tokenId = formData.get('tokenId');
    const wallet = formData.get('wallet');

    const publishStatus = formData.get('publishStatus'); // publish | draft

    console.log(name, isbn, description, tags, artist, cover, content, price, maxMint, tokenId, wallet, publishStatus);

    if(!cover || !artist || !content || !name || !description || !tokenId || !wallet ) {
      return NextResponse.json({error: "All fields are required."}, {status: 400});
    }

    // Handle cover image
    const coverBuffer = Buffer.from(await cover.arrayBuffer());

    // Handle PDF content
    const contentArrayBuffer = await content.arrayBuffer();
    const contentBuffer = Buffer.from(contentArrayBuffer);


    const author = await User.findOne({wallet});

    let bookdData = {
      name,
      isPublished: publishStatus === "publish" || false,
      tokenId,
      contractAddress: contractAdd,
      price,
      maxMint,
      author: author._id,
      artist: artist || null,
      ISBN: isbn || null,
      description,
      tags: tags || []
    }

    const newBook = await Book.create(bookdData);
    console.log("newBook", newBook);

    const status = await uploadFileToS3(coverBuffer, contentBuffer, name, description, tokenId, newBook._id, wallet);

    newBook.cover = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${wallet}/content/${newBook._id}/cover`;
    newBook.pdf = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${wallet}/content/${newBook._id}/book`;

    await newBook.save();

    //add book to author
    author.yourBooks.push(newBook._id);
    await author.save();

    return NextResponse.json({success: status});
  } catch(e) {
    console.error(e);
    return NextResponse.json({error: "Error Uploading File"}, {status: 500});
  }
}