<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# UIFCE Badges Platform

This is an Angular-based badges management platform.

View your app in AI Studio: https://ai.studio/apps/drive/1r4mgQtJz1aOK_GBuPCYi047oor7hPKDd

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key (if applicable)
3. Run the app:
   ```bash
   npm run dev
   ```

## Deploy to GitHub Pages

This repository is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch.

### Setup Instructions

To enable GitHub Pages deployment:

1. Go to your repository settings on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Build and deployment**:
   - Source: Select **GitHub Actions**
4. Push changes to the `main` branch
5. The GitHub Actions workflow will automatically build and deploy your app
6. Your app will be available at: `https://AngelDavidRuizB.github.io/Aplicativo-de-Insignias/`

### Manual Deployment

You can also trigger a deployment manually:
1. Go to the **Actions** tab in your repository
2. Select the **Deploy to GitHub Pages** workflow
3. Click **Run workflow** and select the branch to deploy

## Build

To build the project locally:
```bash
npm run build -- --base-href=/Aplicativo-de-Insignias/
```

The built files will be in the `dist` directory.
