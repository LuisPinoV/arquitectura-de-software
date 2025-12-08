variable "region" {
  default = "us-east-1"
}

variable "project_name"{
  default = "agendin"
}

variable "create_tf_state_bucket" {
  type        = bool
  default     = false
}

variable "tf_state_bucket_name" {
  type        = string
  default     = ""
}

variable "create_tf_lock_table" {
  type        = bool
  default     = false
}

variable "tf_lock_table_name" {
  type        = string
  default     = ""
}