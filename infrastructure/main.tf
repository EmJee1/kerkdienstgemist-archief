# ------------------------------------------------------------------------------
# Required TF providers.
# ------------------------------------------------------------------------------
provider "google" {
  project = var.project
  region  = var.project_region
}

# ----------------------------------------------------
# Enable Required APIs
# ----------------------------------------------------
resource "google_project_service" "required_apis" {
  for_each = toset([
    "workflows.googleapis.com"
  ])

  project            = var.project
  service            = each.value
  disable_on_destroy = false
}
