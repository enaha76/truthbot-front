# Deployment Instructions for Netlify

Your frontend is ready to be deployed to Netlify!

## Configuration Changes
1.  **`netlify.toml`**: Created to configure the build settings (`npm run build`), publish directory (`dist`), and redirects for SPA routing.
2.  **`.env.production`**: Created with `VITE_API_URL=https://truthbot-back.onrender.com/api`.
3.  **Node Version**: Configured Netlify to use Node.js 20 (via `netlify.toml` and `.nvmrc`) because your project uses Vite 6 which requires Node 18+.

## How to Deploy

### Option 1: Connect to Git (Recommended)
1.  Push your changes to a Git repository (GitHub, GitLab, or Bitbucket).
2.  Log in to [Netlify](https://app.netlify.com/).
3.  Click "Add new site" -> "Import an existing project".
4.  Select your repository.
5.  Netlify will detect the settings from `netlify.toml`.
6.  Click "Deploy site".

### Option 2: Netlify CLI
If you have `netlify-cli` installed:
```bash
netlify deploy --prod
```
*Note: This might require a local build first. Since your local Node version is v16, the local build might fail. We recommend Option 1.*

## Important Note
The local build (`npm run build`) fails on your current environment because you are running Node v16, but Vite 6 requires Node 18+ or 20+. **This will NOT affect the Netlify deployment** because we have explicitly configured Netlify to use Node 20.
