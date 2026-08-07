output "frontend_url" {
  description = "URL of the frontend website"
  value       = "https://${var.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.frontend_website.cloudfront_distribution_id
}

output "s3_bucket_id" {
  description = "S3 bucket ID"
  value       = module.frontend_website.s3_bucket_id
}
