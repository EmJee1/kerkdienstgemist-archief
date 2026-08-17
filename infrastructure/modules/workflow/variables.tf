variable "name" {
  type        = string
  description = "Name of the workflow. Also used to derive the executor service account id."
}

variable "project" {
  type        = string
  description = "Google Cloud project ID"
}

variable "region" {
  type        = string
  description = "Region the workflow is deployed to"
}

variable "source_contents" {
  type        = string
  description = "Workflow definition, in YAML"
}

variable "service_account_id" {
  type        = string
  description = "Account id of the executor service account. Defaults to <name> truncated to 30 characters."
  default     = null
}

variable "service_account_display_name" {
  type        = string
  description = "Display name of the executor service account"
  default     = null
}

variable "project_roles" {
  type        = list(string)
  description = "Project level roles granted to the executor service account"
  default     = ["roles/logging.logWriter"]
}

variable "invokes_cloud_run" {
  type = map(object({
    name     = string
    location = string
  }))
  description = "Cloud Run services the workflow may invoke, keyed by a stable logical name"
  default     = {}
}

# ----------------------------------------------------
# Schedule
# ----------------------------------------------------
variable "schedule" {
  type        = string
  description = "Cron schedule that triggers the workflow. Null means the workflow is only triggered manually."
  default     = null
}

variable "schedule_time_zone" {
  type        = string
  description = "Time zone the schedule is interpreted in"
  default     = "Europe/Amsterdam"
}

variable "schedule_arguments" {
  type        = map(string)
  description = "Arguments passed to the workflow on each scheduled run"
  default     = {}
}

variable "schedule_attempt_deadline" {
  type        = string
  description = "How long Cloud Scheduler waits for the execution call to be accepted"
  default     = "60s"
}
