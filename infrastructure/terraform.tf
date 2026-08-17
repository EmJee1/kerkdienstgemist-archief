terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.44.0"
    }
  }

  # Configured per env via envs/<env>.gcs.tfbackend
  backend "gcs" {}

  required_version = ">= 1.15"
}

provider "google" {
  project = var.project
  region  = var.project_region
}
