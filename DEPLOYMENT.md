# Deploying to Vercel

This guide fixes the common **404 on page refresh** and **API not working** issues when deploying Dhaga Kahani to Vercel.

---

## Why you saw 404 errors

1. **React Router SPA** — Routes like `/products` or `/cart` are client-side only. Vercel looked for a real file at that path and returned 404. Fixed with `vercel.json` rewrites to `index.html`.

2. **Express API** — Vercel does not run a long-lived Node server. The API is deployed as a **serverless function** at `api/index.ts`, with explicit routing in `vercel.json`:

```json
"routes": [
  { "src": "/api/(.*)", "dest": "/api/index.ts" },
  { "handle": "filesystem" },
  { "src": "/(.*)", "dest": "/index.html" }
]
```

Seed JSON is copied to `api/data/` during build so the function can read it at runtime.

3. **Wrong root directory** — If Vercel's root was set to `client/` only, the API and rewrites were missing.

---

## Vercel project settings

In your [Vercel Dashboard](https://vercel.com) → Project → **Settings** → **General**:

| Setting | Value |
|---------|--------|
| **Root Directory** | `.` (repo root — **not** `client`) |
| **Framework Preset** | Other |
| **Build Command** | Leave empty (uses `vercel.json`) |
| **Output Directory** | Leave empty (uses `vercel.json`) |
| **Install Command** | Leave empty (uses `vercel.json`) |
| **Node.js Version** | 20.x |

> **Critical:** If Root Directory is set to `client/`, Vercel will **never deploy the API** (`api/` folder is skipped). Clear it or set to `.` (repository root).

The build bundles the Express server into `api/handler.cjs` and copies JSON seed data to `api/data/`.

---

## Environment variables

Add these in Vercel → **Settings** → **Environment Variables**:

| Variable | Value | Required |
|----------|--------|----------|
| `JWT_SECRET` | A long random string | **Yes** (production) |
| `CLIENT_URL` | `https://your-app.vercel.app` | Recommended |
| `JWT_EXPIRES_IN` | `7d` | Optional |

`CLIENT_URL` must match your live Vercel URL for CORS to work.

---

## Deploy steps

```bash
# 1. Push code to GitHub
git add .
git commit -m "Add Vercel deployment config"
git push

# 2. Import repo in Vercel (https://vercel.com/new)
# 3. Confirm Root Directory is the repo root (not client/)
# 4. Add environment variables above
# 5. Deploy
```

Or use the CLI:

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## Verify deployment

After deploy, test these URLs:

| URL | Expected |
|-----|----------|
| `https://your-app.vercel.app/` | Home page |
| `https://your-app.vercel.app/products` | Products page (no 404) |
| `https://your-app.vercel.app/api/health` | `{"status":"ok",...}` |

---

## Important notes

### JSON database on Vercel

The mock JSON database uses `/tmp` on Vercel (writable but **resets on cold starts**). For production, replace with a real database — see `server/src/services/db.service.ts`.

### Split deployment (recommended for production)

For a more reliable API with persistent data:

1. **Frontend** → Vercel (root = `client`, add `client/vercel.json` SPA rewrites only)
2. **Backend** → [Render](https://render.com) or [Railway](https://railway.app) (run `server/` as a Web Service)
3. Set Vercel env: `VITE_API_URL=https://your-api.onrender.com/api`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `/api/health` returns 404 | Root Directory must be `.` not `client`; redeploy after pushing latest code |
| `/api/health` returns 500 | Check Function logs; usually missing `api/data` — run `npm run vercel-build` locally to verify |
| Frontend loads but no products | API not running — test `/api/health` first |
| Build fails on Vercel | Run `npm run vercel-build` locally; fix any TypeScript errors |
| Dashboard overrides config | Clear Build, Output, and Install commands in Vercel settings so `vercel.json` is used |
| 404 on home page | Check **Output Directory** is `client/dist` |
| API returns 404 | Root must not be `client/` only; `api/index.ts` must exist |
| API 500 errors | Set `JWT_SECRET` env var; check Vercel function logs |
| CORS errors | Set `CLIENT_URL` to your exact Vercel URL |
| Build fails | Run `npm run vercel-build` locally to see errors |

Check logs: Vercel Dashboard → Deployments → your deploy → **Functions** / **Build Logs**.
