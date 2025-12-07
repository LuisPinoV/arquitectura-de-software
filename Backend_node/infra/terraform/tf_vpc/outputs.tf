output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_id" {
  value = aws_subnet.public_subnet.id
}

output "private_subnet_id" {
  value = aws_subnet.private_subnet.id
}

output "lambda_private_sg_id" {
  value = aws_security_group.lambda_private_security_group.id
}

output "public_sg_id" {
  value = aws_security_group.public_service_security_group.id
}
