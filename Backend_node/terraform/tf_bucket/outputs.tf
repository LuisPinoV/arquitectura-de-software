output "frontend_bucket" {
    value = aws_s3_bucket.frontend.bucket
}

output "backup_bucket" {
    value = aws_s3_bucket.backups.bucket
}