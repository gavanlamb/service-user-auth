resource "aws_cognito_user_pool" "expensely" {
  name = var.cognito_user_pool_name

  mfa_configuration = "OFF"
  username_attributes = [
    "email"]

  schema {
    name = "email"
    attribute_data_type = "String"
    required = true
    string_attribute_constraints {
      min_length = 4
      max_length = 254
    }
  }
  schema {
    name = "given_name"
    attribute_data_type = "String"
    required = true
    string_attribute_constraints {
      min_length = 1
      max_length = 100
    }
  }
  schema {
    name = "family_name"
    attribute_data_type = "String"
    required = true
    string_attribute_constraints {
      min_length = 1
      max_length = 100
    }
  }
  
  admin_create_user_config {
    allow_admin_create_user_only = false
  }
  
  password_policy {
    minimum_length = 9
    require_lowercase = true
    require_numbers = true
    require_symbols = true
    require_uppercase = true
    temporary_password_validity_days = 1
  }

  auto_verified_attributes = ["email"]
  
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  device_configuration {
    challenge_required_on_new_device = true
    device_only_remembered_on_user_prompt = true
  }

  username_configuration {
    case_sensitive = false
  }
  
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
//    email_sending_account = "DEVELOPER"
//    from_email_address = var.cognito_from_email_address
//    reply_to_email_address = var.cognito_from_email_address
  }
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject_by_link = "Verify your Expensely account"
    email_message_by_link = "{##Click Here##} to verify your account."
  }

  tags = local.default_tags
}

resource "aws_cognito_user_pool_domain" "expensely" {
  domain = local.domain
  user_pool_id = aws_cognito_user_pool.expensely.id
  certificate_arn = data.aws_acm_certificate.wildcard.arn
}
resource "aws_route53_record" "auth" {
  name = aws_cognito_user_pool_domain.expensely.domain
  type = "A"
  zone_id = data.aws_route53_zone.expensely.zone_id
  allow_overwrite = true
  alias {
    evaluate_target_health = false
    name = aws_cognito_user_pool_domain.expensely.cloudfront_distribution_arn
    zone_id = "Z2FDTNDATAQYW2"
  }
}

data "aws_acm_certificate" "wildcard" {
  provider = aws.us-east-1

  domain = var.cognito_client_app_domain
  statuses = ["ISSUED"]
}
