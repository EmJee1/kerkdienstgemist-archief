variable "name" {
  type        = string
  description = "Full name of the bucket"
}

variable "location" {
  type        = string
  description = "Location the bucket is created in"
}

variable "storage_class" {
  type        = string
  description = "Storage class for objects in the bucket"
  default     = "STANDARD"
}

variable "versioning" {
  type        = bool
  description = "Whether object versioning is enabled"
  default     = false
}

variable "force_destroy" {
  type        = bool
  description = "Allow terraform to delete the bucket while it still holds objects"
  default     = false
}

variable "delete_after_days" {
  type        = number
  description = "Delete objects older than this many days. Null disables the lifecycle rule."
  default     = null

  validation {
    condition     = var.delete_after_days == null || try(var.delete_after_days > 0, false)
    error_message = "delete_after_days must be a positive number or null."
  }
}

variable "soft_delete_retention_seconds" {
  type        = number
  description = "Soft delete retention. 0 disables soft delete, null keeps the Google default (7 days)."
  default     = null
}
