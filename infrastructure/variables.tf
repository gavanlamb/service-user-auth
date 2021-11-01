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

variable "lambda_version" {
  type = string
}

variable "custom_message_default_uri" {
  type = string
}
variable "custom_message_log_level" {
  type = string
}
variable "pre_token_generation_log_level" {
  type = string
}

locals {
  domain = "auth.${var.cognito_client_app_domain}"
  custom_message_name = "${var.cognito_user_pool_name}-cognito-custom-message"
  custom_message_filename = "custom-message/custom-message@${var.lambda_version}.zip"
  pre_token_generation_name = "${var.cognito_user_pool_name}-cognito-pre-token-generation"
  pre_token_generation_filename = "pre-token-generation/pre-token-generation@${var.lambda_version}.zip"
}
