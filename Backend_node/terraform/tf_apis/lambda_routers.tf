data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../backend"
  output_path = "${path.module}/../../build/lambda.zip"
}

# IAM role
resource "aws_iam_role" "lambda_router_role" {
  name = "terraform_router_lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_router_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "auth_router_lambda" {
  function_name = "${var.project_name}-router-lambda-auth-handler"
  role          = aws_iam_role.lambda_router_role.arn
  handler       = "src/handlers/auth/cognito.cognitoHandler"
  runtime       = "nodejs22.x"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.auth_router_lambda.invoke_arn
  payload_format_version = "2.0"
}