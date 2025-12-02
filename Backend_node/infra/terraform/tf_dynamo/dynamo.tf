resource "aws_dynamodb_table" "agendamiento" {
  name         = var.AgendamientoTable
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
  name         = var.UserPreferencesTable
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
  name         =  var.CognitoTokenTable
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