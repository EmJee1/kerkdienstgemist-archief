locals {
  service_account_id           = coalesce(var.service_account_id, "kdg-${var.name}")
  service_account_display_name = coalesce(var.service_account_display_name, "kdg ${var.name} runtime")
}

# ----------------------------------------------------
# Runtime identity
# ----------------------------------------------------
resource "google_service_account" "runtime" {
  account_id   = local.service_account_id
  display_name = local.service_account_display_name
}

resource "google_project_iam_member" "roles" {
  for_each = toset(var.project_roles)

  project = var.project
  role    = each.value
  member  = google_service_account.runtime.member
}

resource "google_storage_bucket_iam_member" "buckets" {
  for_each = var.bucket_roles

  bucket = each.value.bucket
  role   = each.value.role
  member = google_service_account.runtime.member
}

resource "google_secret_manager_secret_iam_member" "secrets" {
  for_each = var.secret_roles

  secret_id = each.value.secret_id
  role      = each.value.role
  member    = google_service_account.runtime.member
}

# ----------------------------------------------------
# Service
# ----------------------------------------------------
resource "google_cloud_run_v2_service" "this" {
  name                = var.name
  location            = var.location
  deletion_protection = var.deletion_protection
  ingress             = var.ingress

  template {
    service_account                  = google_service_account.runtime.email
    timeout                          = var.timeout
    max_instance_request_concurrency = var.max_concurrency
    execution_environment            = var.execution_environment

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    containers {
      image = var.image

      resources {
        limits            = { cpu = var.cpu, memory = var.memory }
        cpu_idle          = var.cpu_idle
        startup_cpu_boost = var.startup_cpu_boost
      }

      dynamic "env" {
        for_each = var.env

        content {
          name  = env.key
          value = env.value
        }
      }

      dynamic "env" {
        for_each = var.secret_env

        content {
          name = env.key

          value_source {
            secret_key_ref {
              secret  = env.value.secret_id
              version = env.value.version
            }
          }
        }
      }
    }
  }

  # Images are deployed by CI, unmanaged by Terraform
  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
      client,
      client_version,
    ]
  }

  depends_on = [
    google_secret_manager_secret_iam_member.secrets,
  ]
}
