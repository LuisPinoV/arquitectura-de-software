resource "aws_s3_bucket" "terraform_state" {
  count  = var.create_state_bucket ? 1 : 0
  bucket = var.state_bucket_name != "" ? var.state_bucket_name : "terraform-state-${var.account_id}-${var.region}"
  acl    = "private"

  versioning {
    enabled = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  tags = {
    Name = "terraform-state-bucket"
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state_block" {
  count                  = var.create_state_bucket ? 1 : 0
  bucket                 = aws_s3_bucket.terraform_state[count.index].id
  block_public_acls      = true
  block_public_policy    = true
  ignore_public_acls     = true
  restrict_public_buckets = true
}
