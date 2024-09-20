import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand, DeleteObjectCommand
} from "@aws-sdk/client-s3";

import { getToken } from "next-auth/jwt";


import Book from "@/schemas/bookSchema";
import { connectToDB } from "@/utils/db";

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    }
  });

  async function uploadFileToS3(content, wallet, date) {
    try {
  
      // Upload Content (PDF)
      // console.log("ABOUT TO ENTER CONTENT");
      if (content) {
        try {
          // console.log("CONSOLE IS LOGINNGIN",content);
          const multipartUpload = await s3Client.send(new CreateMultipartUploadCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `users/${wallet}/content/${date}/audio`,
            Body: fileContent,
            ContentType: 'binary/octet-stream',
            ContentDisposition: 'inline',
          }));
      
          const uploadId = multipartUpload.UploadId;
          // console.log("Content length:", content.length);
      
          const partSize = 5 * 1024 * 1024; // 5 MB
          const numParts = Math.ceil(content.length / partSize);
          const uploadPromises = [];
      
          for (let i = 0; i < numParts; i++) {
            const start = i * partSize;
            const end = Math.min(start + partSize, content.length);
            const partNumber = i + 1;
      
            const uploadPartCommand = new UploadPartCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: `users/${wallet}/content/${date}/audio`,
              UploadId: uploadId,
              Body: content.slice(start, end),
              PartNumber: partNumber,
            });
      
            uploadPromises.push(
              s3Client.send(uploadPartCommand)
                .then((data) => {
                  // console.log(`Part ${partNumber} uploaded`);
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
            Key: `users/${wallet}/content/${date}/book`,
            UploadId: uploadId,
            MultipartUpload: { Parts: uploadResults },
          }));
      
          // console.log("Multipart upload completed successfully");
        } catch (error) {
          console.error("Error in multipart upload:", error);
          // Handle the error appropriately (e.g., retry, notify user, etc.)
        }
      }
  
      return true;
    } catch(e) {
      console.error(e);
      return false;
    }
  }