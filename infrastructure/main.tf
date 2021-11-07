resource "aws_cognito_user_pool" "expensely" {
  name = var.cognito_user_pool_name

  mfa_configuration = "OFF"
  username_attributes = [
    "email"]

  schema {
    name = "email"
    attribute_data_type = "String"
    required = true
    mutable = true
    string_attribute_constraints {
      min_length = 4
      max_length = 254
    }
  }
  schema {
    name = "given_name"
    attribute_data_type = "String"
    required = true
    mutable = true
    string_attribute_constraints {
      min_length = 1
      max_length = 100
    }
  }
  schema {
    name = "family_name"
    attribute_data_type = "String"
    required = true
    mutable = true
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

  auto_verified_attributes = [
    "email"]

  account_recovery_setting {
    recovery_mechanism {
      name = "verified_email"
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
    email_sending_account = "DEVELOPER"
    source_arn = "arn:aws:ses:us-east-1:${data.aws_caller_identity.current.id}:identity/${var.cognito_from_email_address}"
    configuration_set = var.cognito_configuration_set
    from_email_address = "Expensely No-Reply <${var.cognito_from_email_address}>"
    reply_to_email_address = var.cognito_from_email_address
  }

  lambda_config {
    custom_message = aws_lambda_function.custom_message.qualified_arn
  }
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

  domain = var.app_domain
  statuses = [
    "ISSUED"]
}

// Custom message
/// Lambda
resource "aws_lambda_function" "custom_message" {
  filename = local.custom_message_filename
  function_name = local.custom_message_name
  role = aws_iam_role.custom_message.arn
  handler = "app.handler"
  runtime = "nodejs14.x"
  memory_size = 512
  publish = true
  timeout = 60
  environment {
    variables = {
      ENVIRONMENT = var.environment
      PACKAGE_VERSION = var.lambda_version
      TABLE_NAME = aws_dynamodb_table.custom_message.name
      SERVICE_NAME = "Cognito custom message Lambda"
      LOG_LEVEL = var.custom_message_log_level
      DEFAULT_URI = var.custom_message_default_uri
    }
  }
}
resource "aws_lambda_permission" "custom_message" {
  principal = "cognito-idp.amazonaws.com"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.custom_message.function_name
  source_arn = aws_cognito_user_pool.expensely.arn
  qualifier = aws_lambda_function.custom_message.version
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_iam_role" "custom_message" {
  name = local.custom_message_name

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}
resource "aws_iam_role_policy_attachment" "custom_message_cloudwatch" {
  role = aws_iam_role.custom_message.name
  policy_arn = aws_iam_policy.lambda_cloudwatch.arn
}
resource "aws_iam_role_policy_attachment" "custom_message_cognito" {
  role = aws_iam_role.custom_message.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonCognitoReadOnly"
}

resource "aws_cloudwatch_log_group" "custom_message" {
  name = "/aws/lambda/${aws_lambda_function.custom_message.function_name}"
  retention_in_days = 14
}

/// DynamoDB
resource "aws_dynamodb_table" "custom_message" {
  name = local.custom_message_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "Organisation"
  range_key = "MessageType"

  attribute {
    name = "MessageType"
    type = "S"
  }

  attribute {
    name = "Organisation"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}
resource "aws_iam_role_policy_attachment" "custom_message_dynamodb" {
  role = aws_iam_role.custom_message.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBReadOnlyAccess"
}

// Cloudwatch
resource "aws_iam_policy" "lambda_cloudwatch" {
  name = "xact-processor-lambda-logging-${var.environment}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

// Clients
resource "aws_cognito_user_pool_client" "app" {
  name = "web app"

  user_pool_id = aws_cognito_user_pool.expensely.id

  access_token_validity = 1
  id_token_validity = 1
  refresh_token_validity = 30
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows = [
    "code"
  ]
  allowed_oauth_scopes = concat(
  [
    "phone",
    "email",
    "openid",
    "profile"
  ],
  sort(aws_cognito_resource_server.time.scope_identifiers)
  )
  callback_urls = [
    "https://${var.app_domain}",
    "https://${var.app_domain}/dashboard"]
  default_redirect_uri = "https://${var.app_domain}"
  enable_token_revocation = true
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
  generate_secret = false
  logout_urls = [
    "https://${var.app_domain}/auth/logout"]
  prevent_user_existence_errors = "ENABLED"
  read_attributes = [
    "email",
    "family_name",
    "given_name",
    "phone_number"]
  supported_identity_providers = [
    "COGNITO"]
  write_attributes = [
    "email",
    "family_name",
    "given_name",
    "phone_number"]
}
resource "aws_cognito_user_pool_client" "postman" {
  name = "postman"

  user_pool_id = aws_cognito_user_pool.expensely.id

  access_token_validity = 1
  id_token_validity = 1
  refresh_token_validity = 30
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows = [
    "code"
  ]
  allowed_oauth_scopes = concat(
  [
    "phone",
    "email",
    "openid",
    "profile"
  ],
  sort(aws_cognito_resource_server.time.scope_identifiers)
  )
  callback_urls = [
    "https://localhost"]
  default_redirect_uri = "https://localhost"
  enable_token_revocation = true
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
  generate_secret = false
  logout_urls = [
    "https://localhost/logout.html"]
  prevent_user_existence_errors = "ENABLED"
  read_attributes = [
    "email",
    "family_name",
    "given_name",
    "phone_number"]
  supported_identity_providers = [
    "COGNITO"]
  write_attributes = [
    "email",
    "family_name",
    "given_name",
    "phone_number"]
}

// Resource servers
resource "aws_cognito_resource_server" "time" {
  identifier = var.time_identifier
  name = "time"

  scope {
    scope_name = "time:create"
    scope_description = "Permission to create records for Time API"
  }
  scope {
    scope_name = "time:delete"
    scope_description = "Permission to delete records for Time API"
  }
  scope {
    scope_name = "time:read"
    scope_description = "Permission to read records for Time API"
  }
  scope {
    scope_name = "time:update"
    scope_description = "Permission to update records for Time API"
  }

  user_pool_id = aws_cognito_user_pool.expensely.id
}