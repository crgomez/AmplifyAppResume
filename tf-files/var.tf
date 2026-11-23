variable "aws_account_id" {
  description = "Target AWS account. AWS_Stack: non-secret env var TF_VAR_aws_account_id. Local: EXPECTED_ACCOUNT_ID from ~/crgomez-ops/config.env."
  type        = string
  # No default (O-13).
  validation {
    condition     = can(regex("^[0-9]{12}$", var.aws_account_id))
    error_message = "aws_account_id must be exactly 12 digits."
  }
}

variable "aws_region" {
  type    = string
  default = "us-west-2"
}

variable "bucket_name" {
  description = "Legacy_Bucket name."
  type        = string
  default     = "crgomez.com"
}
