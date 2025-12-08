output "AgendamientoTableName" {
    value = aws_dynamodb_table.agendamiento.name
}

output "UserPreferencesTableName" {
    value = aws_dynamodb_table.user_preferences.name
}

output "CognitoTokenTableName" {
    value = aws_dynamodb_table.user_token_table.name
}

output "terraform_lock_table" {
    value       = length(aws_dynamodb_table.terraformState) > 0 ? aws_dynamodb_table.terraformState[0].name : ""
}