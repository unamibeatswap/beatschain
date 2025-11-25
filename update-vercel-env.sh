#!/bin/bash

# Update Vercel environment variables for production
echo "Updating Vercel environment variables..."

# Sanity CMS Configuration
vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID production <<< "3tpr4tci"
vercel env add NEXT_PUBLIC_SANITY_DATASET production <<< "production"
vercel env add NEXT_PUBLIC_SANITY_API_VERSION production <<< "2023-05-03"
vercel env add NEXT_PUBLIC_SANITY_API_TOKEN production <<< "skEb5ax8qvLKILVKILVKdckICX3UiPiAV5YFOvMRqqPUXZjyYrWbYyqc8gsB3sq1f81Q7uNTGQDpLwdwWOjWQKn3qnjBaEJRxwkkIBccHTMseQy16TfGKNJXhiXWaxQkYTG8P4dJnHg7lrSnHdFJShzjBoTCneqshU23SVriUvTdKZVZ7bUW5NSS"

echo "Environment variables updated successfully!"
echo "Please redeploy your application for changes to take effect."