# GreenTrail India 🌿

**A complete, production-ready eco-travel platform for conscious explorers of India.**

---

## Pages Included (22 pages)

| Page | Route |
|------|-------|
| Home | `/` |
| Destinations | `/destinations` |
| Destination Detail | `/destinations/:id` |
| Hidden Gems | `/hidden-gems` |
| Eco Retreats | `/stays` |
| Stay Detail | `/stays/:id` |
| Travel Routes | `/travel` |
| AI Planner | `/ai-planner` |
| Trail Journal | `/stories` |
| Story Detail | `/stories/:id` |
| Checkout | `/checkout` |
| Booking Confirmed | `/booking-confirmed` |
| My Journeys | `/my-journeys` |
| Profile | `/profile` |
| Admin Dashboard | `/admin` |
| Login | `/login` |
| Register | `/register` |
| About / Manifesto | `/about` |
| FAQ | `/faq` |
| Contact | `/contact` |
| Seasonal Guide | `/seasonal` |
| 404 Not Found | `*` |

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite 6** (build tool)
- **Tailwind CSS v4** (styling)
- **Wouter** (routing)
- **Framer Motion** (animations)
- **Radix UI** + **shadcn/ui** (components)
- **React Hook Form** + **Zod** (forms + validation)
- **Recharts** (admin analytics)
- **React Query** (data layer)

---

## Quick Start

```bash
npm install
npm run dev        # → http://localhost:3000
npm run build      # production build → /dist
npm run preview    # preview production build
```

---

## Connecting a Real Backend

All data currently lives in `src/lib/api.ts` (mock data) and `src/lib/mockHooks.ts` (mock hooks).

To connect a real API:
1. Replace the mock hooks in `src/lib/mockHooks.ts` with real `fetch`/`axios` calls
2. Update the data types in `src/lib/api.ts` to match your API schema
3. Set your API base URL in a `.env` file: `VITE_API_URL=https://your-api.com`

---

## Deployment

The `/dist` folder is a standard static build. Deploy to:
- **Vercel**: `vercel --prod` (auto-detects Vite)
- **Netlify**: drag-drop the `/dist` folder
- **AWS S3 + CloudFront**: upload `/dist` contents
- **Any static host**: serve `/dist/index.html` for all routes

> ⚠️ For SPA routing (wouter), ensure your host redirects all 404s to `index.html`.

---

*Crafted for the Modern Naturalist.*
