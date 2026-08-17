output "name" {
  description = "Name of the Cloud Run service"
  value       = google_cloud_run_v2_service.this.name
}

output "id" {
  description = "Fully qualified resource name of the Cloud Run service"
  value       = google_cloud_run_v2_service.this.id
}

output "uri" {
  description = "HTTPS endpoint of the Cloud Run service"
  value       = google_cloud_run_v2_service.this.uri
}

output "location" {
  description = "Region the service runs in"
  value       = google_cloud_run_v2_service.this.location
}

output "service_account_email" {
  description = "Email of the runtime service account"
  value       = google_service_account.runtime.email
}

output "service_account_member" {
  description = "IAM member string of the runtime service account"
  value       = google_service_account.runtime.member
}
