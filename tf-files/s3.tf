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

/* Configure bucket policies to allow Cloudflare IP addresses
   https://support.cloudflare.com/hc/en-us/articles/360037983412-Configuring-an-Amazon-Web-Services-static-site-to-use-Cloudflare */
data "aws_iam_policy_document" "crgomez_policy" {
  statement {
    sid    = "PublicReadGetObject"
    effect = "Deny"
    resources = [aws_s3_bucket.crgomez_imgs.arn,
    "${aws_s3_bucket.crgomez_imgs.arn}/*", ]
    actions = [
      "s3:GetObject",
    ]
    condition {
      test     = "NotIpAddress"
      variable = "aws:SourceIp"
      values   = var.ips
    }
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
  }
}