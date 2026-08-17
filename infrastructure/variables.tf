variable "project" {
  type        = string
  description = "Google Cloud project ID where the resources will be created"

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{4,28}[a-z0-9]$", var.project))
    error_message = "project must be a valid Google Cloud project ID."
  }
}

variable "project_region" {
  type        = string
  description = "In what region the project should be deployed"
  default     = "europe-west4"
}

variable "feed_id" {
  type        = string
  description = "Kerkdienstgemist feed identifier for this deployment"

  validation {
    condition     = length(trimspace(var.feed_id)) > 0
    error_message = "feed_id must not be empty."
  }
}

variable "backup_schedule" {
  type        = string
  description = "Cron schedule for the kdg-backup workflow. Null leaves the workflow manual only."
  default     = null
}

variable "deletion_protection" {
  type        = bool
  description = "Whether Cloud Run services are protected against deletion. Set false in throwaway environments where the stack needs to be destroyable."
  default     = true
}

locals {
  bootstrap_image           = "us-docker.pkg.dev/cloudrun/container/hello"
  backup_schedule_time_zone = "Europe/Amsterdam"
}
