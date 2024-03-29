﻿variable "environment" {
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

variable "app_domain" {
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
variable "time_identifier" {
  type = string
}

locals {
  domain = "auth.${var.app_domain}"
  custom_message_name = "${var.cognito_user_pool_name}-cognito-custom-message"
  custom_message_filename = "custom-message/custom-message@${var.lambda_version}.zip"
}
