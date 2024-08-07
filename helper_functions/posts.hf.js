const crypto = require("crypto");
const sharp = require("sharp");
const {
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3 } = require("../db/s3Config.js");
require("dotenv").config();

const randomImgName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

const modifyBuffer = async (buffer) =>
  await sharp(buffer)
    .rotate()
    .resize({ width: 300, height: 300, fit: sharp.fit.inside, withoutEnlargement: true })
    .toBuffer();

const getSignedUrlFromS3 = async (mediaName) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: mediaName,
    });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    throw new Error(`Error getting signed URL from S3: ${error}`);
  }
};

const addToS3 = async (file) => {
  try {
    const mediaName = randomImgName();
    const modifiedBuffer = await modifyBuffer(file.buffer);
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: mediaName,
      Body: modifiedBuffer,
      ContentType: file.mimetype,
    });
    await s3.send(uploadCommand);
    return mediaName;
  } catch (error) {
    throw new Error(`Error uploading to S3: ${error}`);
  }
};

const deleteFromS3 = async (key) => {
  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });
    await s3.send(deleteCommand);
  } catch (error) {
    throw new Error(`Error deleting from S3: ${error}`);
  }
};

module.exports = { addToS3, deleteFromS3, getSignedUrlFromS3 };
