variable "AgendamientoTable" {
  type = string
}

variable "UserPreferencesTable" {
  type = string
}

variable "CognitoTokenTable" {
  type = string
}

variable "account_id" {
  type=string
}

variable "create_lock_table" {
  type        = bool
  default     = false
}

variable "lock_table_name" {
  type        = string
  default     = ""
}