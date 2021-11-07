data "aws_route53_zone" "expensely" {
  name = var.app_domain
}
data "aws_route53_zone" "zone" {
  name = "${var.app_domain}."
}

data "aws_caller_identity" "current" {}
