provider "aws" {
  region  = var.region
  default_tags {
    tags = {
      Application = "Expensely"
      Team = "Expensely Core"
      ManagedBy = "Terraform"
      Environment = var.environment
    }
  }
}

provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
  default_tags {
    tags = {
      Application = "Expensely"
      Team = "Expensely Core"
      ManagedBy = "Terraform"
      Environment = var.environment
    }
  }
}