output "AgendamientoTableName" {
    value = aws_dynamodb_table.agendamiento.name
}

output "UserPreferencesTableName" {
    value = aws_dynamodb_table.user_preferences.name
}

output "CognitoTokenTableName" {
    value = aws_dynamodb_table.user_token_table.name
}