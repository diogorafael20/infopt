# InfoPT — Portuguese News Aggregator

🗞️ Aggregate Portuguese news from multiple sources (domestic, international, sports, finance) via RSS feeds. Exposted as JSON API + RSS feed + React Native mobile app.

## Features

- **RSS Feed Aggregation** — Collects news from Portuguese sources (Público, Observador, etc.)
- **Multiple Categories** — Portugal · International · Football · Finance
- **API Endpoint** — JSON API for easy consumption
- **RSS Feed** — Generate dynamic RSS from aggregated content
- **React Native App** — Mobile app for iOS/Android (coming soon)

## Tech Stack

- **Backend:** Cloudflare Workers + itty-router
- **Database:** Cloudflare D1 (SQLite)
- **Frontend:** React Native + Expo
- **Deployment:** Cloudflare Pages / Workers

## Project Structure

```
infopt/
├── src/
│   ├── index.ts          # Main Worker handler
│   ├── handlers/         # API handlers
│   ├── lib/              # Utilities (RSS parser, etc.)
│   └── types/            # TypeScript types
├── data/
│   └── sources.json      # News sources configuration
├── mobile/               # React Native app (coming soon)
├── wrangler.toml
└── package.json
```

## Getting Started

### Setup

```bash
npm install
```

### Development

```bash
npm run dev
# Runs on http://localhost:8787
```

### Deploy

```bash
wrangler deploy
```

## API Endpoints

### Get News by Category

```bash
GET /api/news/:category
```

**Categories:** `portugal`, `internacional`, `futebol`, `financas`

**Response:**
```json
[
  {
    "title": "News headline",
    "link": "https://...",
    "description": "Short description...",
    "pubDate": "2024-08-17T10:00:00Z",
    "source": "Público",
    "category": "portugal"
  }
]
```

### Health Check

```bash
GET /health
```

## News Sources

### Portugal
- Público
- Observador
- Expresso
- Visão

### International
- BBC
- Reuters
- CNN

### Football
- Abola
- Record
- Maisfutebol

### Finance
- ECO
- Dinheiro Vivo
- Negócios

## Next Steps

- [ ] Implement Cloudflare D1 for caching
- [ ] Generate RSS feed from API
- [ ] Build React Native app (Expo)
- [ ] Add filtering & search
- [ ] Implement PWA
- [ ] User preferences (saved sources)

## License

MIT
