variable "environment" {
  type = string
}
variable "region" {
  type = string
}

variable "cognito_user_pool_name" {
  type = string
}
variable "cognito_from_email_address" {
  type = string
}

variable "base_domain_name" {
  type = string
}

variable "cognito_resource_time_identifier" {
  type = string
}
variable "cognito_client_app_domain" {
  type = string
}

locals {
  domain = "auth.${var.base_domain_name}"
  default_tags = {
    Application = "Expensely"
    Team = "Expensely Core"
    ManagedBy = "Terraform"
    Environment = var.environment
  }
}
