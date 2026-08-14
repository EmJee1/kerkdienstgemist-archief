# ----------------------------------------------------
# Required TF providers.
# ----------------------------------------------------
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

# ----------------------------------------------------
# Storage Bucket
# ----------------------------------------------------
resource "google_storage_bucket" "rss-snapshots" {
  name     = "${var.project}-rss-snapshots"
  location = var.project_region

  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  versioning {
    enabled = false
  }
}

resource "google_storage_bucket" "recordings" {
  name     = "${var.project}-recordings"
  location = var.project_region

  storage_class               = "STANDARD"
  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  versioning {
    enabled = false
  }
}

# ----------------------------------------------------
# Services
# ----------------------------------------------------
resource "google_secret_manager_secret" "feed_access_key" {
  secret_id = "kdg-feed-access-key"

  replication {
    user_managed {
      replicas {
        location = var.project_region
      }
    }
  }
}

resource "google_service_account" "discovery_runtime" {
  account_id   = "kdg-discovery"
  display_name = "kdg discovery runtime"
}

resource "google_service_account" "ingest_runtime" {
  account_id   = "kdg-ingest"
  display_name = "kdg ingest runtime"
}

resource "google_project_iam_member" "discovery_firestore" {
  project = var.project
  role    = "roles/datastore.user"
  member  = google_service_account.discovery_runtime.member
}

resource "google_project_iam_member" "ingest_firestore" {
  project = var.project
  role    = "roles/datastore.user"
  member  = google_service_account.ingest_runtime.member
}

resource "google_storage_bucket_iam_member" "discovery_archive_writer" {
  bucket = google_storage_bucket.rss-snapshots.name
  role   = "roles/storage.objectCreator"
  member = google_service_account.discovery_runtime.member
}

resource "google_storage_bucket_iam_member" "ingest_media_admin" {
  bucket = google_storage_bucket.recordings.name
  role   = "roles/storage.objectAdmin"
  member = google_service_account.ingest_runtime.member
}

resource "google_secret_manager_secret_iam_member" "discovery_reads_key" {
  secret_id = google_secret_manager_secret.feed_access_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = google_service_account.discovery_runtime.member
}

resource "google_secret_manager_secret_iam_member" "ingest_reads_key" {
  secret_id = google_secret_manager_secret.feed_access_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = google_service_account.ingest_runtime.member
}

resource "google_cloud_run_v2_service" "discovery" {
  name                = "discovery"
  location            = var.project_region
  deletion_protection = false
  ingress             = "INGRESS_TRAFFIC_ALL"

  template {
    service_account                  = google_service_account.discovery_runtime.email
    timeout                          = "540s"
    max_instance_request_concurrency = 4

    scaling {
      min_instance_count = 0
      max_instance_count = 2
    }

    containers {
      image = local.bootstrap_image

      resources {
        limits            = { cpu = "1", memory = "512Mi" }
        cpu_idle          = true
        startup_cpu_boost = true
      }

      env {
        name  = "KDG_FEED_ID"
        value = var.feed_id
      }

      env {
        name = "KDG_ACCESS_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.feed_access_key.secret_id
            version = "latest"
          }
        }
      }

      env {
        name  = "ARCHIVE_BUCKET"
        value = google_storage_bucket.rss-snapshots.name
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
      client,
      client_version,
    ]
  }

  depends_on = [
    google_secret_manager_secret_iam_member.discovery_reads_key,
  ]
}

resource "google_cloud_run_v2_service" "ingest" {
  name                = "ingest"
  location            = var.project_region
  deletion_protection = false
  ingress             = "INGRESS_TRAFFIC_ALL"

  template {
    service_account                  = google_service_account.ingest_runtime.email
    timeout                          = "1800s"
    max_instance_request_concurrency = 1
    execution_environment            = "EXECUTION_ENVIRONMENT_GEN2"

    scaling {
      min_instance_count = 0
      max_instance_count = 3
    }

    containers {
      image = local.bootstrap_image

      resources {
        limits   = { cpu = "1", memory = "512Mi" }
        cpu_idle = true
      }

      env {
        name  = "KDG_FEED_ID"
        value = var.feed_id
      }
      env {
        name = "KDG_ACCESS_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.feed_access_key.secret_id
            version = "latest"
          }
        }
      }
      env {
        name  = "MEDIA_BUCKET"
        value = google_storage_bucket.recordings.name
      }
      env {
        name  = "LEASE_DURATION_SECONDS"
        value = "2400"
      }
      env {
        name  = "ABORT_AFTER_MS"
        value = "1700000"
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
      client,
      client_version,
    ]
  }

  depends_on = [
    google_secret_manager_secret_iam_member.ingest_reads_key,
  ]
}

# ----------------------------------------------------
# Workflow
# ----------------------------------------------------
resource "google_service_account" "workflow_executor" {
  account_id   = "kdg-workflow"
  display_name = "kdg-backup workflow executor"
}

resource "google_project_iam_member" "workflow_logs" {
  project = var.project
  role    = "roles/logging.logWriter"
  member  = google_service_account.workflow_executor.member
}

resource "google_cloud_run_v2_service_iam_member" "workflow_invokes_ingest" {
  project  = var.project
  location = var.project_region
  name     = google_cloud_run_v2_service.ingest.name
  role     = "roles/run.invoker"
  member   = google_service_account.workflow_executor.member
}

resource "google_workflows_workflow" "kdg_backup" {
  name            = "kdg-backup"
  region          = var.project_region
  service_account = google_service_account.workflow_executor.id
  source_contents = ""

  depends_on = [
    google_project_service.required_apis,
  ]
}
