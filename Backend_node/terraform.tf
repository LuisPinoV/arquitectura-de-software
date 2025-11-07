provider "aws" {
  region = "us-east-1"
}


# DynamoDB

resource "aws_dynamodb_table" "agendamiento" {
  name         = "Agendamiento"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"
  range_key    = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  attribute {
    name = "PacienteId"
    type = "S"
  }

  attribute {
    name = "FechaPaciente"
    type = "S"
  }

  attribute {
    name = "FuncionarioId"
    type = "S"
  }

  attribute {
    name = "FechaFuncionario"
    type = "S"
  }

  attribute {
    name = "BoxId"
    type = "S"
  }

  attribute {
    name = "FechaBox"
    type = "S"
  }

  global_secondary_index {
    name            = "AgendamientosPorPaciente"
    hash_key        = "PacienteId"
    range_key       = "FechaPaciente"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "AgendamientosPorFuncionario"
    hash_key        = "FuncionarioId"
    range_key       = "FechaFuncionario"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "AgendamientosPorBox"
    hash_key        = "BoxId"
    range_key       = "FechaBox"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "user_preferences" {
  name         = "UserPreferences"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "profileType"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "profileType"
    type = "S"
  }

    tags = {
    Environment = "Dev"
    Feature     = "BlueGreenDeploy"
  }
}

resource "aws_dynamodb_table" "user_token_table" {
  name         = "UserCognitoToken"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"

  attribute {
    name = "userId"
    type = "S"
  }
  
    tags = {
    Environment = "Dev"
    Feature     = "BlueGreenDeploy"
  }
}

# Buckets de S3

variable "region" {
  default = "us-east-1"
}

data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
}

# Bucket publico para el frontend

resource "aws_s3_bucket" "frontend" {
  bucket = "frontend-${local.account_id}-${var.region}"
}

resource "aws_s3_bucket_website_configuration" "frontend_site" {
  bucket = aws_s3_bucket.frontend.bucket

  index_document {
    suffix = "index.html"  #placeholder hasta que se termine el frontend
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend_block" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = true
  block_public_policy     = false
  ignore_public_acls      = true
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

# Bucket privado para backup de base de datos

resource "aws_s3_bucket" "backups" {
  bucket = "backups-${local.account_id}-${var.region}"
}

resource "aws_s3_bucket_public_access_block" "backups_block" {
  bucket                  = aws_s3_bucket.backups.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "backups_encryption" {
  bucket = aws_s3_bucket.backups.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "backups_versioning" {
  bucket = aws_s3_bucket.backups.id

  versioning_configuration {
    status = "Enabled"
  }
}

# SERVERLESS

resource "null_resource" "deploy_serverless" {
  depends_on = [
    aws_dynamodb_table.agendamiento,
    aws_dynamodb_table.user_preferences
  ]

  provisioner "local-exec" {
    interpreter = ["cmd", "/C"]

    # Se ejecuta en la carpeta donde está terraform.tf y serverless.yaml
    working_dir = "${path.module}"

    command = <<-EOT
      echo === Desplegando funciones Serverless ===
      npx serverless deploy --config serverless.yaml --debug
      echo terminó serverless
    EOT
  }
}

