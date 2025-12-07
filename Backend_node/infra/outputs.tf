output "VPC" {
    value = {
        private_subnet_id = module.VPC.private_subnet_id
        public_subnet_id = module.VPC.public_subnet_id
        lambda_sg_id = module.VPC.lambda_private_sg_id
        lambda_public_sg_id = module.VPC.public_sg_id
    }
}

output "dynamo" {
    value = {
        agendamiento = module.dynamo.AgendamientoTableName
        preferences = module.dynamo.UserPreferencesTableName
        tokens = module.dynamo.CognitoTokenTableName
    }
}

output "s3_bucket" {
    value = {
        backup = module.s3_bucket.frontend_bucket
        frontend = module.s3_bucket.backup_bucket
    }
}