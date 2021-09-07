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

variable "cognito_client_app_domain" {
  type = string
}
variable "cognito_configuration_set" {
  type = string
}

locals {
  domain = "auth.${var.cognito_client_app_domain}"
  default_tags = {
    Application = "Expensely"
    Team = "Expensely Core"
    ManagedBy = "Terraform"
    Environment = var.environment
  }
}
