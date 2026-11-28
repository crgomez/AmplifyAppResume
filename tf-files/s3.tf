resource "aws_s3_bucket" "crgomez_imgs" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_versioning" "versioning_control" {
  bucket = aws_s3_bucket.crgomez_imgs.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Requirement 13 criterion 12: equivalent declarative construct for removing the
# legacy public policy from management (removed blocks need Terraform 1.7).
moved {
  from = aws_s3_bucket_policy.crgomez_policy
  to   = aws_s3_bucket_policy.legacy_interim
}

resource "aws_s3_bucket_policy" "legacy_interim" {
  bucket = aws_s3_bucket.crgomez_imgs.id
  policy = data.aws_iam_policy_document.legacy_interim.json
}

data "aws_iam_policy_document" "legacy_interim" {
  statement {
    sid     = "InterimRetainedObjectsRead" # Requirement 1 criterion 3
    effect  = "Allow"
    actions = ["s3:GetObject"]
    resources = [
      "${aws_s3_bucket.crgomez_imgs.arn}/crgomez-security-engineer.pdf",
      "${aws_s3_bucket.crgomez_imgs.arn}/hero-banner.png",
      "${aws_s3_bucket.crgomez_imgs.arn}/amplify.png",
    ]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}
