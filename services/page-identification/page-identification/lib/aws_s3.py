import datetime
import json
from boto3 import client as boto3_client, resource as boto3_resource
from magic_pixel import logger
from magic_pixel.utility import env

s3_resource = boto3_resource(
    "s3",
    region_name="us-east-1",
)
s3_client = boto3_client("s3")


# Example: put_object(
#       c.EXPORT_S3_BUCKET,
#       key_prefix + "rewards.csv",
#       obj_str=rio.getvalue(),
#       content_type="text/csv",
#     )


def put_object(
    bucket_name,
    object_name,
    obj=None,
    obj_str=None,
    content_type="text/json",
    acl="bucket-owner-full-control",
    content_encoding=None,
    content_length=None,
):
    # some boto3 optional args don't default to None, so if we pass None to them explicitly boto3 craps out
    optional_put_args = {}
    if content_encoding is not None:
        optional_put_args["ContentEncoding"] = content_encoding

    if content_length is not None:
        optional_put_args["ContentLength"] = content_length

    try:
        return s3_resource.Bucket(bucket_name).put_object(
            Key=object_name,
            Body=json.dumps(obj) if obj else obj_str,
            ACL=acl,
            ContentType=content_type,
            **optional_put_args
        )
    except Exception as e:
        logger.log_exception(e)


def get_object(bucket_name, key):
    return s3_resource.Object(bucket_name, key)
