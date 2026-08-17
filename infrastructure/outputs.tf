output "rss_snapshots_bucket" {
  description = "Bucket holding RSS feed snapshots"
  value       = module.rss_snapshots_bucket.name
}

output "recordings_bucket" {
  description = "Bucket holding archived recordings"
  value       = module.recordings_bucket.name
}

output "feed_access_key_secret_id" {
  description = "Secret holding the kerkdienstgemist feed access key"
  value       = module.feed_access_key.secret_id
}

output "discovery_url" {
  description = "Endpoint of the discovery service"
  value       = module.discovery.uri
}

output "discovery_service_account" {
  description = "Runtime service account of the discovery service"
  value       = module.discovery.service_account_email
}

output "ingest_url" {
  description = "Endpoint of the ingest service"
  value       = module.ingest.uri
}

output "ingest_service_account" {
  description = "Runtime service account of the ingest service"
  value       = module.ingest.service_account_email
}

output "backup_workflow_id" {
  description = "Fully qualified name of the backup workflow"
  value       = module.backup_workflow.id
}
