# Deploying to GitHub Pages

## Option A — Simplest (recommended)

Uses the `gh-pages` npm package to push the `alt-static/` folder directly as the site root.

```powershell
# From the repo root
npx gh-pages -d alt-static
```

Your site will be available at `https://<username>.github.io/<repo-name>/`.

## Option B — Manual (no extra package)

```powershell
# From the repo root
git subtree push --prefix alt-static origin gh-pages
```

This pushes just the contents of `alt-static/` to the `gh-pages` branch.

## Enable Pages in GitHub

1. Go to your repo → **Settings** → **Pages**
2. Under *Branch*, select `gh-pages` / `/ (root)`
3. Click **Save** — your site will be live in ~1 minute

## Updating the site

After editing `data.js`, redeploy with the same command:

```powershell
# From the repo root
npx gh-pages -d alt-static
```

> **Note:** If the repo has no remote yet, add one first:
> ```powershell
> git remote add origin https://github.com/<username>/<repo>.git
> ```
