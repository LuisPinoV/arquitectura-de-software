resource "aws_dynamodb_table" "terraformState" {
  count        = var.create_lock_table ? 1 : 0
  name         = var.lock_table_name != "" ? var.lock_table_name : "terraformState"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name = "terraform-state-lock-table"
  }
}
