# Deploying to Vercel

This guide fixes the common **404 on page refresh** and **API not working** issues when deploying ShopHub to Vercel.

---

## Why you saw 404 errors

1. **React Router SPA** — Routes like `/products` or `/cart` are client-side only. Vercel looked for a real file at that path and returned 404. Fixed with `vercel.json` rewrites to `index.html`.

2. **Express API** — Vercel does not run a long-lived Node server. The API is deployed as a **serverless function** via `api/[...path].ts` (handles all `/api/*` routes). Do **not** rewrite `/api/*` to a single `/api` endpoint — that strips the path and breaks routes like `/api/health`.

3. **Wrong root directory** — If Vercel's root was set to `client/` only, the API and rewrites were missing.

---

## Vercel project settings

In your [Vercel Dashboard](https://vercel.com) → Project → **Settings** → **General**:

| Setting | Value |
|---------|--------|
| **Root Directory** | `.` (repo root — **not** `client`) |
| **Framework Preset** | Other |
| **Build Command** | `npm run vercel-build` *(or leave empty — uses vercel.json)* |
| **Output Directory** | `client/dist` |
| **Install Command** | `npm install && npm install --prefix client && npm install --prefix server` |

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
| 404 on `/products`, `/cart`, etc. | Root must be repo root; `vercel.json` must include SPA rewrite |
| 404 on home page | Check **Output Directory** is `client/dist` |
| API returns 404 | Root must not be `client/` only; `api/index.ts` must exist |
| API 500 errors | Set `JWT_SECRET` env var; check Vercel function logs |
| CORS errors | Set `CLIENT_URL` to your exact Vercel URL |
| Build fails | Run `npm run vercel-build` locally to see errors |

Check logs: Vercel Dashboard → Deployments → your deploy → **Functions** / **Build Logs**.
