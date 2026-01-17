# Kerdienstgemist Archief

Archive for church services hosted at [kerdienstgemist-archief.web.app](https://kerdienstgemist-archief.web.app).

## Projects

### functions

Firebase Cloud Functions that handle RSS feed parsing and automated archival. Built with TypeScript and runs on Node.js
22.

### upload

CLI tool for manually uploading church services to the archive. Uses Firebase Admin SDK to interact with Firestore. May
be used to automatically pull in services if they were missed by the scheduled pipeline.

### web

Vue 3 web application for browsing and accessing archived services. Built with Vite, TypeScript, and Bulma CSS.

## Deployment

GitHub Actions workflows automatically deploy the web application on changes:

- **firebase-hosting-merge.yml** - Deploys to production on pushes to `main` branch
- **firebase-hosting-pull-request.yml** - Creates preview deployments for pull requests
