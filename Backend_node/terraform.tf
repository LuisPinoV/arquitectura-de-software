provider "aws" {
  region = "us-east-1"
}


# IAM

/*
resource "aws_iam_role" "lambda_role" {
  name = "LabRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "lambda_policy" {
  name        = "LambdaDynamoPolicy"
  description = "Permisos de Lambda sobre DynamoDB, Logs y STS"
  policy      = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["dynamodb:*"]
        Resource = [
          "arn:aws:dynamodb:us-east-1:*:table/Agendamiento",
          "arn:aws:dynamodb:us-east-1:*:table/Agendamiento/index/*",
          "arn:aws:dynamodb:us-east-1:*:table/UserPreferences"
        ]
      },
      {
        Effect = "Allow"
        Action = ["logs:*"]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = ["sts:AssumeRole"]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_lambda_policy" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}
*/

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
}


# Cognito


resource "aws_cognito_user_pool" "user_pool" {
  name = "arquitectura-serverless-pool"
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = true
  }
}

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name         = "arquitectura-serverless-app"
  user_pool_id = aws_cognito_user_pool.user_pool.id
  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  prevent_user_existence_errors = "ENABLED"

  access_token_validity  = 60
  id_token_validity      = 60
  refresh_token_validity = 30

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }
}

resource "aws_cognito_user_group" "admin_group" {
  name         = "Administradores"
  user_pool_id = aws_cognito_user_pool.user_pool.id
  description  = "Grupo de administradores del sistema"
}


# API Gateway


resource "aws_apigatewayv2_api" "http_api" {
  name          = "arquitectura-serverless-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_authorizer" "cognito_jwt" {
  api_id          = aws_apigatewayv2_api.http_api.id
  name            = "cognitoJwt"
  authorizer_type = "JWT"
  identity_sources = ["$request.header.Authorization"]

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.user_pool_client.id]
    issuer   = "https://cognito-idp.us-east-1.amazonaws.com/${aws_cognito_user_pool.user_pool.id}"
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

# Outputs


output "user_pool_id" {
  value = aws_cognito_user_pool.user_pool.id
}

output "user_pool_client_id" {
  value = aws_cognito_user_pool_client.user_pool_client.id
}

output "http_api_url" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
}


# SERVERLESS

resource "null_resource" "deploy_serverless" {
  depends_on = [
    aws_dynamodb_table.agendamiento,
    aws_dynamodb_table.user_preferences,
    aws_cognito_user_pool.user_pool,
    aws_cognito_user_pool_client.user_pool_client,
    aws_apigatewayv2_api.http_api
  ]

  provisioner "local-exec" {
    interpreter = ["cmd", "/C"]
    command = <<-EOT
      echo Desplegando funciones Serverless...
      set USER_POOL_ID=${aws_cognito_user_pool.user_pool.id}
      set USER_POOL_CLIENT_ID=${aws_cognito_user_pool_client.user_pool_client.id}
      set API_URL=${aws_apigatewayv2_api.http_api.api_endpoint}
      npx serverless deploy --config serverless_terraform.yml
    EOT
  }
}

