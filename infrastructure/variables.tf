variable "project" {
  type        = string
  description = "Google Cloud project ID where the resources will be created."
}

variable "project_region" {
  type    = string
  default = "In what region the project should be deployed."
}
