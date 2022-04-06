const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3')
const { CloudFrontClient, CreateInvalidationCommand } = require('@aws-sdk/client-cloudfront')
const fs = require('fs')
const crypto = require('crypto')

const env = process.env.NODE_ENV || 'dev'
const bucketName = 'magic-pixel-public'
const distroId = ''

let objectName = 'mp-event-tracker'
if (env !== 'production') {
  objectName += `.${env}`
}
objectName += '.js'

const filepath = process.argv[2]
const file = fs.readFileSync(filepath)
const fileHash = crypto.createHash('sha1', { defaultEncoding: 'hex' })
fileHash.write(file)
fileHash.end()
const fileHashString = fileHash.digest('hex')

const objectParams = {
  Bucket: bucketName,
  Key: objectName,
  Body: fs.readFileSync(filepath),
  ACL: 'public-read',
  ContentType: 'text/javascript',
  // max-age = browsers will cache for 20 min
  // s-max-age = cloudfront edges will cache from s3 for 24 hours (unless we invalidate)
  CacheControl: 'max-age=1200, s-max-age=86400',
}

const s3Client = new S3Client({ region: 'us-east-1' })
const cfClient = new CloudFrontClient({ region: 'us-east-1' })

async function deploy() {
  console.log(`Deploying launch to bucket ${bucketName}, key ${objectName}`)
  try {
    console.log('uploading file')
    const command = new PutObjectCommand(objectParams)
    await s3Client.send(command)
    console.log('invalidating cloudfront cached version')
    // Invalidate launch script cached in cloudfront edges, so edges will grab new version from s3
    const inCommand = new CreateInvalidationCommand({
      DistributionId: distroId,
      InvalidationBatch: { CallerReference: fileHashString, Paths: { Quantity: 1, Items: [`/${objectName}`] } },
    })
    await cfClient.send(inCommand)
    console.log('Deploy great success!')
  } catch (e) {
    console.dir(e)
    console.log(e)
  }
}

deploy()
