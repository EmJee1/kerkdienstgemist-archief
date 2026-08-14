variable "project" {
  type        = string
  description = "Google Cloud project ID where the resources will be created"
}

variable "project_region" {
  type        = string
  description = "In what region the project should be deployed"
  default     = "europe-west4"
}

variable "feed_id" {
  type        = string
  description = "Kerkdienstgemist feed identifier for this deployment"
}

locals {
  bootstrap_image = "us-docker.pkg.dev/cloudrun/container/hello"
}
