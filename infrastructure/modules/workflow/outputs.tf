output "name" {
  description = "Name of the workflow"
  value       = google_workflows_workflow.this.name
}

output "id" {
  description = "Fully qualified resource name of the workflow"
  value       = google_workflows_workflow.this.id
}

output "service_account_email" {
  description = "Email of the executor service account"
  value       = google_service_account.executor.email
}

output "service_account_member" {
  description = "IAM member string of the executor service account"
  value       = google_service_account.executor.member
}

output "scheduler_job_name" {
  description = "Name of the Cloud Scheduler job, or null when the workflow is manual only"
  value       = one(google_cloud_scheduler_job.trigger[*].name)
}
