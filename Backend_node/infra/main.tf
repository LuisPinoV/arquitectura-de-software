data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
}

module "dynamo" {
  source = "./terraform/tf_dynamo"
  AgendamientoTable    = "Agendamiento"
  UserPreferencesTable = "UserPreferences"
  CognitoTokenTable    = "UserCognitoToken"
  account_id           = local.account_id
  create_lock_table    = var.create_tf_lock_table
  lock_table_name      = var.tf_lock_table_name
}

module "s3_bucket" {
  source     = "./terraform/tf_bucket"
  account_id = local.account_id
  region     = var.region
  create_state_bucket = var.create_tf_state_bucket
  state_bucket_name   = var.tf_state_bucket_name
}

module "VPC" {
  source = "./terraform/tf_vpc"
  region = var.region
}

