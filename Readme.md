scrapers-multi-platform/
├── config/
│   ├── platforms.json          # Config de cada plataforma
│   └── cookies/
│       ├── mercadolivre.json
│       ├── shopee.json
│       ├── shein.json
│       ├── amazon.json
│       └── aliexpress.json
├── src/
│   ├── scrapers/
│   │   ├── base.scraper.js     # Scraper base (abstrato)
│   │   ├── mercadolivre.js
│   │   ├── shopee.js
│   │   ├── shein.js
│   │   ├── amazon.js
│   │   └── aliexpress.js
│   ├── queue/
│   │   ├── queue.manager.js
│   │   └── worker.js
│   ├── cache/
│   │   └── redis.client.js
│   ├── browser/
│   │   └── pool.manager.js     # Pool de browsers
│   └── utils/
│       ├── logger.js
│       └── metrics.js
├── index.js
├── package.json
└── docker-compose.yml