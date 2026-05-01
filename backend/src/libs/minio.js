import * as Minio from 'minio'
import dotenv from 'dotenv'
dotenv.config()

const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
})

const bucket = process.env.MINIO_DEFAULT_BUCKET

const exists = await minioClient.bucketExists(bucket)
if (exists) {
  console.log("Bucket " + bucket + "exists.")
} else {
  await minioClient.makeBucket(bucket)
  console.log("Bucket " + bucket + "created")
}

export default minioClient