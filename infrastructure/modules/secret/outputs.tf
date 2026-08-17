output "secret_id" {
  description = "Short identifier of the secret, as used in Cloud Run secret references"
  value       = google_secret_manager_secret.this.secret_id
}

output "id" {
  description = "Fully qualified resource name of the secret"
  value       = google_secret_manager_secret.this.id
}

output "bootstrap_version_id" {
  description = "Resource name of the bootstrap secret version"
  value       = google_secret_manager_secret_version.bootstrap.id
}
