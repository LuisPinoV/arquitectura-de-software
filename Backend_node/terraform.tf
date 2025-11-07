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

# S3
/*
resource "aws_s3_bucket" "frontend" {
  bucket = "frontend-app-uni-20251234567890" # nombre fijo
}

resource "aws_s3_bucket_public_access_block" "frontend_block" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_website_configuration" "frontend_site" {
  bucket = aws_s3_bucket.frontend.bucket

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html" # importante para apps SPA/Next export
  }
}
*/


# SERVERLESS

resource "null_resource" "deploy_serverless" {
  depends_on = [
    aws_dynamodb_table.agendamiento,
    aws_dynamodb_table.user_preferences,
    aws_dynamodb_table.user_token_table
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

