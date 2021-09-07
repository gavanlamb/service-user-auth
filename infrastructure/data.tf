data "aws_route53_zone" "expensely" {
  name = var.cognito_client_app_domain
}
data "aws_route53_zone" "zone" {
  name = "${var.cognito_client_app_domain}."
}

data "aws_caller_identity" "current" {}
