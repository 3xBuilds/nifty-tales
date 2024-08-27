import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";

import { getToken } from "next-auth/jwt";


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
    console.log("UPLOADING YOOOOOO");


    if(cover){
      console.log("COVER MY ASS", cover);
      const coverParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `users/${wallet}/content/${tokenId}/cover`,
        Body: cover,
        ContentType: "image/png"
      }
      const coverCommand = new PutObjectCommand(coverParams);
      await s3Client.send(coverCommand);
      console.log("COVER IS DONE", cover);
    }

    // Upload Content (PDF)
    console.log("ABOUT TO ENTER CONTENT");
    if (content) {
      try {
        console.log("CONSOLE IS LOGINNGIN",content);
        const multipartUpload = await s3Client.send(new CreateMultipartUploadCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `users/${wallet}/content/${tokenId}/book`,
          ContentType: 'application/pdf',
          ContentDisposition: 'inline',
        }));
    
        const uploadId = multipartUpload.UploadId;
        console.log("Content length:", content.length);
    
        const partSize = 5 * 1024 * 1024; // 5 MB
        const numParts = Math.ceil(content.length / partSize);
        const uploadPromises = [];
    
        for (let i = 0; i < numParts; i++) {
          const start = i * partSize;
          const end = Math.min(start + partSize, content.length);
          const partNumber = i + 1;
    
          const uploadPartCommand = new UploadPartCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `users/${wallet}/content/${tokenId}/book`,
            UploadId: uploadId,
            Body: content.slice(start, end),
            PartNumber: partNumber,
          });
    
          uploadPromises.push(
            s3Client.send(uploadPartCommand)
              .then((data) => {
                console.log(`Part ${partNumber} uploaded`);
                return { ETag: data.ETag, PartNumber: partNumber };
              })
              .catch((error) => {
                console.error(`Error uploading part ${partNumber}:`, error);
                throw error;
              })
          );
        }
    
        const uploadResults = await Promise.all(uploadPromises);
    
        await s3Client.send(new CompleteMultipartUploadCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `users/${wallet}/content/${tokenId}/book`,
          UploadId: uploadId,
          MultipartUpload: { Parts: uploadResults },
        }));
    
        console.log("Multipart upload completed successfully");
      } catch (error) {
        console.error("Error in multipart upload:", error);
        // Handle the error appropriately (e.g., retry, notify user, etc.)
      }
    }

    if(cover && content){

      // Create a json file with metadata
      const metadata = {
        name,
        description: description + ". Visit https://niftytales.xyz/books/"+objectId,
        tokenId,
        image: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${wallet}/content/${tokenId}/cover`,
        content: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${wallet}/content/${tokenId}/book`
      }
      const metadataParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `users/${wallet}/metadata/${tokenId}`,
        Body: JSON.stringify(metadata),
        ContentType: "application/json"
      }
      const metadataCommand = new PutObjectCommand(metadataParams);
      await s3Client.send(metadataCommand);
    }

    return true;
  } catch(e) {
    console.error(e);
    return false;
  }
}

export async function POST(request) {
  try {
    console.log("UPLOAD FUNCTION HAS BEEN CALLED");

    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
  });
  
  if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

    const formData = await request.formData();
    connectToDB();
    
    const name = formData.get('name');
    const isbn = formData.get('isbn');
    const description = formData.get('description');
    const tags = formData.getAll('tags') || [];
    const artist = formData.get('artist') || "";
    const contractAdd = formData.get('contractAdd');
    const cover = formData.get('cover') || null;
    const content = formData.get('content') || null;
    const price = formData.get('price') || 0;
    const maxMint = formData.get('maxMint') || 0;
    const tokenId = formData.get('tokenId');
    const wallet = formData.get('wallet');
    const id = formData.get('id');

    const publishStatus = false; 

    console.log("COVER",cover, content)
    if( !name  || !tags || !tokenId || !wallet ) {
      return NextResponse.json({error: "All fields are required."}, {status: 401});
    }

    const author = await User.findOne({wallet});

    if(!author){
      return NextResponse.json({message:"Author not found"},{status:404});
    }

    let bookdData = {
      name,
      isPublished: publishStatus === "publish" || false,
      tokenId,
      contractAddress: contractAdd,
      price,
      maxMint,
      author: author._id,
      artist: artist || null,
      ISBN: isbn || "",
      description,
      tags: tags || []
    }

    if(publishStatus == "draft" && content && !cover && id==""){
      const contentArrayBuffer = await content.arrayBuffer();
      const contentBuffer = Buffer.from(contentArrayBuffer);
      const book = await Book.create(bookdData);
      const status = await uploadFileToS3(null, contentBuffer, name, description, tokenId, book._id, wallet);

      if(status){
        author.yourBooks.push(book._id);
        await author.save();
        
  
        if(status === true){ 
          book.pdf = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${wallet}/content/${tokenId}/book`;
          book.isPublished = false;
          book.createdAt = Date.now();
          await book.save();
          return NextResponse.json({success: book});
        }

      }

      else{
        await Book.findOneAndDelete({_id:book._id});
      }
    }


    if(cover && !content && id !== ""){
      const coverBuffer = Buffer.from(await cover.arrayBuffer());
      const status = await uploadFileToS3(coverBuffer, null, name, description, tokenId, id, wallet);

      if(status === false) {
        return NextResponse.json({error: "Something went wrong while uploading"}, {status: 501});
      }

      if(status === true){
        const book = await Book.findById(id);
        book.name = name;
        book.isbn = isbn
        book.cover = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${wallet}/content/${tokenId}/cover`;
        book.description = description;
        book.tags = tags;
        book.artist = artist;
        book.price = price;
        book.tokenId = tokenId;
        book.maxMint = maxMint;
        if(publishStatus == "draft"){
          book.isPublished = false;
        }
        else{
          book.isPublished = true
        }
        book.createdAt = Date.now();
        
        await book.save();

        author.yourBooks.push(id);
        await author.save()
        return NextResponse.json({success: book});
      }

    }
    // Handle PDF content
    if(content && !cover && id !== ""){
      const contentArrayBuffer = await content.arrayBuffer();
      const contentBuffer = Buffer.from(contentArrayBuffer);

      const status = await uploadFileToS3(null, contentBuffer, name, description, tokenId, id, wallet);

      if(status === false) {
        return NextResponse.json({error: "Something went wrong while uploading"}, {status: 501});
      }

      if(status === true){
        const book = await Book.findById(id);
        book.name = name;
        book.isbn = isbn
        book.description = description;
        book.tags = tags;
        book.pdf = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${wallet}/content/${tokenId}/book`;

        book.artist = artist;
        book.price = price;
        book.tokenId = tokenId;
        book.maxMint = maxMint;
        if(publishStatus == "draft"){
          book.isPublished = false;
        }
        else{
          book.isPublished = true
        }        
        book.createdAt = Date.now();
        await book.save();

        author.yourBooks.push(id);
        await author.save()
        return NextResponse.json({success: book});
      }
    }


    if(content && cover && id == ""){
      const contentArrayBuffer = await content.arrayBuffer();
      const contentBuffer = Buffer.from(contentArrayBuffer);
      const coverBuffer = Buffer.from(await cover.arrayBuffer());
      const newBook = await Book.create(bookdData);
      const status = await uploadFileToS3(coverBuffer, contentBuffer, name, description, tokenId, newBook._id, wallet);
      
      if(status === true){
        author.yourBooks.push(newBook._id);
        await author.save()
        // console.log("Hellooooooo");
        // console.log("NEW BOOK",newBook)
        newBook.cover = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${wallet}/content/${tokenId}/cover`;
        newBook.pdf = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${wallet}/content/${tokenId}/book`;

        await newBook.save();

        return NextResponse.json({success: newBook});
      }
      else{
        await Book.findOneAndDelete({_id:newBook._id});
      }
    }

    if(content && cover && id !== ""){

      const contentArrayBuffer = await content.arrayBuffer();
      const contentBuffer = Buffer.from(contentArrayBuffer);
      const coverBuffer = Buffer.from(await cover.arrayBuffer());

      const status = await uploadFileToS3(coverBuffer, contentBuffer, name, description, tokenId, id, wallet);

      if(status === true){
        
        const book = await Book.findById(id);
        book.name = name;
        book.isbn = isbn
        book.description = description;
        book.tags = tags;
        book.pdf = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/users/${wallet}/content/${tokenId}/book`;

        book.artist = artist;
        book.price = price;
        book.tokenId = tokenId;
        book.maxMint = maxMint;
        if(publishStatus == "draft"){
          book.isPublished = false;
        }
        else{
          book.isPublished = true
        }        
        book.createdAt = Date.now();
        await book.save();


          author.yourBooks.push(id);
          await author.save()

        return NextResponse.json({success: book});

      }
    }

  } catch(e) {
    console.error(e);
    return NextResponse.json({error: "Error Uploading File"}, {status: 500});
  }
}

export async function PATCH(request){
  try {
    const formData = await request.formData();
    connectToDB();
    
    const name = formData.get('name');
    const isbn = formData.get('isbn');
    const description = formData.get('description');
    const tags = formData.getAll('tags') || [];
    const artist = formData.get('artist');

    const price = formData.get('price') || 0;
    const maxMint = formData.get('maxMint') || 0;
    const tokenId = formData.get('tokenId');
    const wallet = formData.get('wallet');
    const id = formData.get("id");

    if(!name || !tags || !tokenId || !wallet ) {
      return NextResponse.json({error: "All fields are required."}, {status: 400});
    }

    const book = await Book.findById(id);
        book.name = name;
        book.isbn = isbn
        book.maxMint = maxMint;
        book.description = description;
        book.tags = tags;
        book.artist = artist;
        book.price = price;
        book.tokenId = tokenId;
        book.isPublished = false;
        book.createdAt = Date.now();
        await book.save();
        return NextResponse.json({success: book});


  }
  catch(err){
    
    return NextResponse.json({error: "Error Updating File"}, {status: 500});

  }
}

