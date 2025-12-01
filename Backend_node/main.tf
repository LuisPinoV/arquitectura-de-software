data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
}

module "dynamo"{
    source = "./terraform/tf_dynamo"
}

module "s3_bucket" {
    source = "./terraform/tf_bucket"
    account_id = local.account_id
    region = var.region
}

module "VPC" {
  source = "./terraform/tf_vpc"
  region = var.region
}

output "private_subnet_id" {
  value = module.VPC.private_subnet_id
}

output "lambda_private_sg" {
  value = module.VPC.lambda_private_sg_id
}