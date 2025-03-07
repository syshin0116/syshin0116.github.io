---
title: Deploy Obsidian Notes on GitHub Pages with Quartz
date: 2025-03-06
tags:
  - obsidian
  - quartz
  - github-pages
  - blog
draft: false
enableToc: true
description: ""
published: 2025-03-06
modified: 2025-03-06
---
## Overview

This guide outlines how to convert Markdown notes written in **Obsidian** into a static website using **Quartz** and deploy it on **GitHub Pages**.

[[Getting started with Zettelkasten and Obsidian]]

### References
- **YouTube**: [How to publish your notes for free with Quartz](https://www.youtube.com/watch?v=6s6DT1yN4dw&t=1s)
- **Official Quartz Documentation**: [Quartz 4.0](https://quartz.jzhao.xyz/)

![](https://i.imgur.com/r5O2hdl.png)

---

## 1. Initialize Local Quartz Folder

Clone Quartz, install dependencies, and initialize the project.

```bash
git clone https://github.com/jackyzha0/quartz.git
cd quartz
npm i
npx quartz create
```

### Initialization Options

- Select **Empty Quartz** if starting from scratch
- For link resolution, choose **Treat links as shortest path**

![](https://i.imgur.com/z1HbfPW.png)
![](https://i.imgur.com/J5VcxZh.png)

---

## 2. Set Up GitHub Repository

**Official Quartz Documentation**: [Setting up your GitHub repository](https://quartz.jzhao.xyz/setting-up-your-GitHub-repository)

### Updating Remote Repository
Since Quartz is cloned from the official repository, the default remote (`origin`) points to the Quartz repo. Change it to your own GitHub repository.

```bash
# Check current remote repositories
git remote -v
 
# Update the origin remote to point to your GitHub repository
git remote set-url origin https://github.com/syshin0116/syshin0116.github.io.git
 
# Add upstream remote to keep updates from the official Quartz repository
git remote add upstream https://github.com/jackyzha0/quartz.git
```

Now, your Quartz project is linked to your GitHub repository and ready for deployment.

---

## 3. Deploying to GitHub Pages

Use GitHub Pages to host your Quartz site.

### 1) Configure GitHub Actions
To automate deployment, create a `.github/workflows/deploy.yml` file and add the following content:

>[!Note] 
>Quartz 4.0 uses `v4` as the default main branch, but I didn’t like it, so I changed it to `main`.

```yml
name: Deploy Quartz site to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Fetch all history for git info
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Install Dependencies
        run: npm ci
      - name: Build Quartz
        run: npx quartz build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: public

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

>[!Note]- If you've configured your main branch to `main` like I did, you also need to update `quartz/cli/constants.js`.
>```javascript
>import path from "path"
>import { readFileSync } from "fs"
>
>export const ORIGIN_NAME = "origin"
>export const UPSTREAM_NAME = "upstream"
>export const QUARTZ_SOURCE_BRANCH = "main" // update branch
>export const cwd = process.cwd()
>export const cacheDir = path.join(cwd, ".quartz-cache")
>export const cacheFile = "./quartz/.quartz-cache/transpiled-build.mjs"
>export const fp = "./quartz/build.ts"
>export const { version } = JSON.parse(readFileSync("./package.json").toString())
>export const contentCacheFolder = path.join(cacheDir, "content-cache")
>``` 
### 2) Enable GitHub Pages
- Go to **GitHub → Repository → Settings → Pages**
- Set **Source** to **GitHub Actions**
- After deployment, check the site URL

---

## 4. Building and Syncing the Site

### Build the Quartz Site Locally
Before deployment, verify that Quartz builds correctly on your local machine.

```bash
npx quartz build --serve
```

Open [http://localhost:8080](http://localhost:8080) in your browser to preview the site.

### Sync Changes to GitHub

The official documentation instructed the following:
```bash
npx quartz sync
```


Now, your site is live on GitHub Pages.

---

## 5. Setting Up a Custom Domain (Optional)

By default, your site is hosted at `https://yourusername.github.io/your-repository-name/`.
To use a custom domain, follow these steps:

### 1) Configure Domain DNS
In your domain's **DNS records**, add the following A records:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### 2) Update GitHub Pages Settings
- Go to **GitHub → Repository → Settings → Pages**
- Enter your custom domain under **Custom domain** and click **Save**
- Enable **Enforce HTTPS**

Once DNS changes propagate, your site will be accessible via your custom domain.

---

## Conclusion
You have now successfully set up Quartz to convert Obsidian notes into a static website and deployed it on GitHub Pages. Next, you can customize the site further by modifying `quartz.config.ts`, changing the theme, or integrating additional Obsidian plugins.

Use this guide to create and maintain your own note-sharing platform easily!

