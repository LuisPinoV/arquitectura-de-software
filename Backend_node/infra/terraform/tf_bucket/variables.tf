variable "account_id" {
    type=string
}

variable "region" {
  type=string
}

variable "state_bucket_name" {
  type        = string
  default     = ""
}

variable "create_state_bucket" {
  type        = bool
  default     = false
}