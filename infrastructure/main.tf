# ----------------------------------------------------
# Enable Required APIs
# ----------------------------------------------------
resource "google_project_service" "required_apis" {
  for_each = toset([
    "artifactregistry.googleapis.com",
    "firestore.googleapis.com",
    "iam.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "storage.googleapis.com",
    "workflows.googleapis.com",
    "cloudscheduler.googleapis.com"
  ])

  project            = var.project
  service            = each.value
  disable_on_destroy = false
}

# ----------------------------------------------------
# Storage Buckets
# ----------------------------------------------------
module "rss_snapshots_bucket" {
  source = "./modules/storage-bucket"

  name     = "${var.project}-rss-snapshots"
  location = var.project_region

  delete_after_days             = 30
  soft_delete_retention_seconds = 0

  depends_on = [google_project_service.required_apis]
}

module "recordings_bucket" {
  source = "./modules/storage-bucket"

  name     = "${var.project}-recordings"
  location = var.project_region

  depends_on = [google_project_service.required_apis]
}

# ----------------------------------------------------
# Secrets
# ----------------------------------------------------
module "feed_access_key" {
  source = "./modules/secret"

  secret_id         = "kdg-feed-access-key"
  replica_locations = [var.project_region]

  depends_on = [google_project_service.required_apis]
}

# ----------------------------------------------------
# Services
# ----------------------------------------------------
module "discovery" {
  source = "./modules/cloud-run-worker"

  name     = "discovery"
  project  = var.project
  location = var.project_region
  image    = local.bootstrap_image

  timeout           = "540s"
  max_concurrency   = 4
  max_instances     = 2
  startup_cpu_boost = true

  env = {
    KDG_FEED_ID    = var.feed_id
    ARCHIVE_BUCKET = module.rss_snapshots_bucket.name
    NODE_ENV       = "production"
  }

  secret_env = {
    KDG_ACCESS_KEY = { secret_id = module.feed_access_key.secret_id }
  }

  project_roles = ["roles/datastore.user"]

  bucket_roles = {
    snapshots = {
      bucket = module.rss_snapshots_bucket.name
      role   = "roles/storage.objectCreator"
    }
  }

  secret_roles = {
    feed_access_key = { secret_id = module.feed_access_key.secret_id }
  }

  depends_on = [module.feed_access_key]
}

module "ingest" {
  source = "./modules/cloud-run-worker"

  name     = "ingest"
  project  = var.project
  location = var.project_region
  image    = local.bootstrap_image

  timeout               = "1800s"
  max_concurrency       = 1
  max_instances         = 3
  execution_environment = "EXECUTION_ENVIRONMENT_GEN2"

  env = {
    KDG_FEED_ID            = var.feed_id
    MEDIA_BUCKET           = module.recordings_bucket.name
    LEASE_DURATION_SECONDS = "2400"
    ABORT_AFTER_MS         = "1700000"
    NODE_ENV               = "production"
  }

  secret_env = {
    KDG_ACCESS_KEY = { secret_id = module.feed_access_key.secret_id }
  }

  project_roles = ["roles/datastore.user"]

  bucket_roles = {
    recordings = {
      bucket = module.recordings_bucket.name
      role   = "roles/storage.objectAdmin"
    }
  }

  secret_roles = {
    feed_access_key = { secret_id = module.feed_access_key.secret_id }
  }

  depends_on = [module.feed_access_key]
}

# ----------------------------------------------------
# Workflow
# ----------------------------------------------------
module "backup_workflow" {
  source = "./modules/workflow"

  name            = "kdg-backup"
  project         = var.project
  region          = var.project_region
  source_contents = file("${path.module}/workflow.yaml")

  service_account_id           = "kdg-workflow"
  service_account_display_name = "kdg-backup workflow executor"

  invokes_cloud_run = {
    ingest = {
      name     = module.ingest.name
      location = module.ingest.location
    }
  }

  schedule           = var.backup_schedule
  schedule_time_zone = local.backup_schedule_time_zone

  depends_on = [google_project_service.required_apis]
}
