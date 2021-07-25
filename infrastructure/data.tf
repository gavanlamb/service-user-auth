data "aws_route53_zone" "expensely" {
  name = var.base_domain_name
}
data "aws_route53_zone" "zone" {
  name = "${var.base_domain_name}."
}
