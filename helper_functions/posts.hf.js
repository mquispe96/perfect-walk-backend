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

module.exports = { deleteFromS3 };
