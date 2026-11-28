# Maintainer: Carlos R Gomez
# Project: document delivery for crgomez.com (Terraform_AWS, applied by AWS_Stack)

terraform {
  required_version = ">= 1.5.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0" # Requirement 13 criterion 1
    }
  }
  # No backend block: Spacelift-managed state (Requirement 15 criterion 15)
}

provider "aws" {
  region              = var.aws_region
  allowed_account_ids = [var.aws_account_id] # O-13: refuses to plan or apply against any other account
}
