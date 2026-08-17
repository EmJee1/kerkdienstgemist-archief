variable "name" {
  type        = string
  description = "Name of the Cloud Run service. Also used to derive the service account id."
}

variable "project" {
  type        = string
  description = "Google Cloud project ID"
}

variable "location" {
  type        = string
  description = "Region the service runs in"
}

variable "image" {
  type        = string
  description = "Container image. Only used on create; later deploys are owned by CI."
}

variable "service_account_id" {
  type        = string
  description = "Account id of the runtime service account. Defaults to kdg-<name>."
  default     = null
}

variable "service_account_display_name" {
  type        = string
  description = "Display name of the runtime service account. Defaults to '<name> runtime'."
  default     = null
}

# ----------------------------------------------------
# Runtime shape
# ----------------------------------------------------
variable "timeout" {
  type        = string
  description = "Request timeout, as a duration string"
  default     = "300s"
}

variable "max_concurrency" {
  type        = number
  description = "Maximum concurrent requests per instance"
  default     = 1
}

variable "min_instances" {
  type        = number
  description = "Minimum number of instances"
  default     = 0
}

variable "max_instances" {
  type        = number
  description = "Maximum number of instances"
  default     = 1
}

variable "cpu" {
  type        = string
  description = "CPU limit per instance"
  default     = "1"
}

variable "memory" {
  type        = string
  description = "Memory limit per instance"
  default     = "512Mi"
}

variable "cpu_idle" {
  type        = bool
  description = "Whether CPU is throttled outside of request handling"
  default     = true
}

variable "startup_cpu_boost" {
  type        = bool
  description = "Whether to boost CPU during instance startup"
  default     = false
}

variable "execution_environment" {
  type        = string
  description = "Execution environment. Null uses the Cloud Run default."
  default     = null

  validation {
    condition = var.execution_environment == null || contains(
      ["EXECUTION_ENVIRONMENT_GEN1", "EXECUTION_ENVIRONMENT_GEN2"],
      coalesce(var.execution_environment, "EXECUTION_ENVIRONMENT_GEN1")
    )
    error_message = "execution_environment must be EXECUTION_ENVIRONMENT_GEN1, EXECUTION_ENVIRONMENT_GEN2 or null."
  }
}

variable "ingress" {
  type        = string
  description = "Ingress setting for the service"
  default     = "INGRESS_TRAFFIC_ALL"
}

variable "deletion_protection" {
  type        = bool
  description = "Whether the service is protected against deletion. Terraform cannot destroy or replace a protected service until this is set back to false and applied."
  default     = true
}

# ----------------------------------------------------
# Configuration
# ----------------------------------------------------
variable "env" {
  type        = map(string)
  description = "Plain environment variables"
  default     = {}
}

variable "secret_env" {
  type = map(object({
    secret_id = string
    version   = optional(string, "latest")
  }))
  description = "Environment variables sourced from Secret Manager, keyed by variable name"
  default     = {}
}

# ----------------------------------------------------
# IAM granted to the runtime service account
# ----------------------------------------------------
variable "project_roles" {
  type        = list(string)
  description = "Project level roles granted to the runtime service account"
  default     = []
}

variable "bucket_roles" {
  type = map(object({
    bucket = string
    role   = string
  }))
  description = "Bucket level roles granted to the runtime service account, keyed by a stable logical name"
  default     = {}
}

variable "secret_roles" {
  type = map(object({
    secret_id = string
    role      = optional(string, "roles/secretmanager.secretAccessor")
  }))
  description = "Secret level roles granted to the runtime service account, keyed by a stable logical name"
  default     = {}
}
