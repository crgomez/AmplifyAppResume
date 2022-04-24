# Maintainer: Carlos R Gomez
# Project: Host site images on AWS S3 Bucket

provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
    bucket = "crgomez.com-state"
    region = "us-west-2"
    key    = "crgomez/terraform.tfstate"
  }
}