resource "google_secret_manager_secret" "this" {
  secret_id = var.secret_id

  replication {
    user_managed {
      dynamic "replicas" {
        for_each = toset(var.replica_locations)

        content {
          location = replicas.value
        }
      }
    }
  }
}

# Bootstrap placeholder secret to make sure dependant deployments succeed.
# The real value is set manually via `gcloud secrets versions add`.
resource "google_secret_manager_secret_version" "bootstrap" {
  secret      = google_secret_manager_secret.this.id
  secret_data = var.bootstrap_value

  lifecycle {
    ignore_changes = [secret_data]
  }
}
