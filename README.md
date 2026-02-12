# PayAtlas

Crowdsourced salary transparency platform.

## Stack
- **Frontend**: Next.js 14 + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google/LinkedIn SSO ready)
- **Charts**: Recharts

## Setup

1. Clone and install:
```bash
npm install
```

2. Environment variables are pre-configured in `.env.local`

3. Run locally:
```bash
npm run dev
```

4. Open http://localhost:3000

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or connect GitHub repo to Vercel for auto-deploys.

## Supabase Project

- **Project**: PayAtlas
- **Region**: us-east-1  
- **URL**: https://jubbwfxlionayrkvrydo.supabase.co

## Next Steps

- [ ] Enable Google/LinkedIn SSO in Supabase dashboard
- [ ] Add more filters to explore page
- [ ] Seed with sample data
- [ ] Add company search autocomplete
- [ ] Build company profiles page
