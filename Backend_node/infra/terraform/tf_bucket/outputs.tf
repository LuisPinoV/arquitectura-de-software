output "frontend_bucket" {
    value = aws_s3_bucket.frontend.bucket
}

output "backup_bucket" {
    value = aws_s3_bucket.backups.bucket
}

output "terraform_state_bucket" {
    value       = length(aws_s3_bucket.terraform_state) > 0 ? aws_s3_bucket.terraform_state[0].bucket : ""
    description = "S3 bucket used to store Terraform state (empty if not created)"
}