locals {
  service_account_id           = coalesce(var.service_account_id, substr(var.name, 0, 30))
  service_account_display_name = coalesce(var.service_account_display_name, "${var.name} workflow executor")
  scheduled                    = var.schedule != null
}

# ----------------------------------------------------
# Executor identity
# ----------------------------------------------------
resource "google_service_account" "executor" {
  account_id   = local.service_account_id
  display_name = local.service_account_display_name
}

resource "google_project_iam_member" "roles" {
  for_each = toset(var.project_roles)

  project = var.project
  role    = each.value
  member  = google_service_account.executor.member
}

resource "google_cloud_run_v2_service_iam_member" "invoker" {
  for_each = var.invokes_cloud_run

  project  = var.project
  location = each.value.location
  name     = each.value.name
  role     = "roles/run.invoker"
  member   = google_service_account.executor.member
}

# ----------------------------------------------------
# Workflow
# ----------------------------------------------------
resource "google_workflows_workflow" "this" {
  name            = var.name
  region          = var.region
  service_account = google_service_account.executor.id
  source_contents = var.source_contents
}

# ----------------------------------------------------
# Schedule
#
# Cloud Scheduler calls the Workflows Executions API directly, authenticating as
# the same service account the workflow itself runs as.
# ----------------------------------------------------
# Granted at project level: the provider has no resource level IAM binding for
# workflows.
resource "google_project_iam_member" "scheduler_invoker" {
  count = local.scheduled ? 1 : 0

  project = var.project
  role    = "roles/workflows.invoker"
  member  = google_service_account.executor.member
}

resource "google_cloud_scheduler_job" "trigger" {
  count = local.scheduled ? 1 : 0

  name             = "${var.name}-schedule"
  region           = var.region
  schedule         = var.schedule
  time_zone        = var.schedule_time_zone
  attempt_deadline = var.schedule_attempt_deadline

  http_target {
    http_method = "POST"
    uri         = "https://workflowexecutions.googleapis.com/v1/${google_workflows_workflow.this.id}/executions"

    headers = {
      "Content-Type" = "application/json"
    }

    body = base64encode(jsonencode({
      argument = jsonencode(var.schedule_arguments)
    }))

    oauth_token {
      service_account_email = google_service_account.executor.email
    }
  }

  depends_on = [
    google_project_iam_member.scheduler_invoker,
  ]
}
