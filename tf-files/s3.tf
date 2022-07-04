resource "aws_s3_bucket" "crgomez_imgs" {
  bucket = var.bucket_name
  acl    = var.acl_value
}

resource "aws_s3_bucket_versioning" "versioning_control" {
  bucket = aws_s3_bucket.crgomez_imgs.id
  versioning_configuration {
    status = "Enabled"
  }

}

resource "aws_s3_bucket_policy" "crgomez_policy" {
  bucket = aws_s3_bucket.crgomez_imgs.id
  policy = data.aws_iam_policy_document.crgomez_policy.json

}

data "aws_iam_policy_document" "crgomez_policy" {
  statement {
    sid    = ""
    effect = "Allow"
    resources = [aws_s3_bucket.crgomez_imgs.arn,
    "${aws_s3_bucket.crgomez_imgs.arn}/*", ]
    actions = [
      "s3:ListBucket",
      "s3:GetObject",
    ]
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

  }
}