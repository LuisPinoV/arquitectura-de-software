output "api_gateway_id" {
  value = aws_apigatewayv2_api.http_api.id
}

output "api_gateway_lambda_integration_id" {
  value = aws_apigatewayv2_integration.lambda_integration.id
}