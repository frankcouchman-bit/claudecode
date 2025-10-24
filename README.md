# SEOScribe — Next.js + shadcn/ui Frontend (with Dashboard + MCP)

**What’s inside**
- Marketing pages + demo generator wired to your Worker
- Auth (magic link + Google) via Worker, token capture
- Dashboard (plan/usage, articles) + Stripe checkout/portal buttons
- CLAUDE.md, `.mcp/config.json`, and Playwright MCP scripts
- Node **18.17.0** (.nvmrc) and **latest** deps

## Quickstart
```bash
nvm install 18.17.0 && nvm use 18.17.0
npm i
cp .env.example .env.local
npm run dev  # http://localhost:3000
```

## Deploy
```bash
npm run build
git init && git add . && git commit -m "feat: SaaS frontend + dashboard wired to Worker"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```
Set env on host: `NEXT_PUBLIC_API_URL=https://seoscribe.frank-couchman.workers.dev`.

## Claude MCP
Enable Playwright MCP in Claude Desktop (see CLAUDE.md), then paste scripts from `scripts/mcp/`.
