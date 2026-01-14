# CI/CD Pipeline Setup Guide

This project includes a GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that automatically builds, tests (lints), and containerizes your application.

## 🚀 Features

- **Automated Linting**: checks code quality for both Backend and Frontend.
- **Automated Builds**: compiles TypeScript and builds the Frontend assets.
- **Docker Image Generation**: builds and pushes Docker images to the GitHub Container Registry (ghcr.io) on changes to the main branch.
- **Deployment Ready**: includes a placeholder for deployment to your preferred hosting provider.

## 🔑 Configuration

To make the pipeline work, you need to add the following **Secrets** to your GitHub Repository.

Go to: **Settings** > **Secrets and variables** > **Actions** > **New repository secret**

### Required Secrets (Frontend Build)

These values are injected into the Frontend during the build process:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `VITE_BASE_URL` | Base URL for the API | `https://api.yourdomain.com` |
| `VITE_SOCKET_URL` | URL for the WebSocket server | `https://api.yourdomain.com` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `offwego-cloud` |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary Upload Preset | `offwego_preset` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Public Key | `pk_test_...` |
| `VITE_OPENCAGE_API_KEY` | OpenCage API Key | `abcd1234...` |
| `VITE_IMAGE_URL` | Base URL for images | `https://res.cloudinary.com/...` |

### Deployment Secrets (Choose your method)

The `deploy` job in the workflow is currently commented out. You need to uncomment the section relevant to your hosting provider in `.github/workflows/ci-cd.yml` and add the corresponding secrets.

#### Option 1: VPS / SSH Deployment
If you are deploying to a Linux server (DigitalOcean Droplet, EC2, Linode, etc.):

| Secret Name | Description |
|-------------|-------------|
| `SERVER_HOST` | IP address or hostname of your server |
| `SERVER_USER` | Username to SSH into (e.g., `root` or `ubuntu`) |
| `SERVER_SSH_KEY` | Private SSH key (content of your `.pem` or `id_rsa` file) |

#### Option 2: DigitalOcean App Platform
| Secret Name | Description |
|-------------|-------------|
| `DIGITALOCEAN_ACCESS_TOKEN` | Your Personal Access Token from DigitalOcean |

#### Option 3: Railway
| Secret Name | Description |
|-------------|-------------|
| `RAILWAY_TOKEN` | Your Railway Project Token |

## 📦 Docker Registry

The pipeline pushes images to the **GitHub Container Registry** (`ghcr.io`).
- **Backend Image**: `ghcr.io/<your-username>/offwego/backend:latest`
- **Frontend Image**: `ghcr.io/<your-username>/offwego/frontend:latest`

Make sure your repository settings allow write access to packages if you encounter permission errors.

## 🏃‍♂️ How to Run

1. **Push to `main`**: This triggers the full pipeline including Docker builds and deployment.
2. **Pull Requests**: Triggers linting and building to ensure code quality before merging.
