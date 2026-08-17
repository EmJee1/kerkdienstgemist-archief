variable "secret_id" {
  type        = string
  description = "Identifier of the secret"
}

variable "replica_locations" {
  type        = list(string)
  description = "Regions the secret is replicated to"

  validation {
    condition     = length(var.replica_locations) > 0
    error_message = "At least one replica location is required."
  }
}

variable "bootstrap_value" {
  type        = string
  description = "Placeholder value for the initial version, so dependants can deploy before the real value is set"
  default     = "REPLACE_ME"
  sensitive   = true
}
