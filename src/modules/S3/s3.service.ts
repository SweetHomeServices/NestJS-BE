import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
var mammoth = require("mammoth");

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName = process.env.S3_BUCKET_NAME; // e.g. 'my-bucket'

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.S3_REGION || 'us-east-1',
    });
  }

  /**
   * Uploads a file buffer to S3 under a given key.
   */
  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    const key = `uploads/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await this.s3Client.send(command);

    // Return the S3 key or a full URL (depending on your preference).
    return key;
  }

  /**
   * Retrieves a file from S3 and returns a buffer (so we can parse it with mammoth, etc).
   */
  async getFile(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const data = await this.s3Client.send(command);

    // The Body is a Readable stream in Node.js, so we need to convert it to a buffer.
    const stream = data.Body as Readable;
    const chunks: Uint8Array[] = [];

    for await (const chunk of stream) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }

    return Buffer.concat(chunks);
  }

  async extractDocxTextFromS3(s3Key: string): Promise<string> {
    // 1. Retrieve the file buffer from S3
    const fileBuffer = await this.getFile(s3Key);

    // 2. Use mammoth to extract text
    //    (This only works well for .docx; for .doc you need other solutions.)
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value; // The extracted text
  }
}
