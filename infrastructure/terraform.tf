terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.44.0"
    }
  }

  backend "gcs" {
    bucket = "tf-state-stg"
    prefix = "terraform/state"
  }

  required_version = ">= 1.15"
}

provider "google" {
  project = var.project
  region  = var.project_region
}
