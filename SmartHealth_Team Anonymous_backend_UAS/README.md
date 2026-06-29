# SmartHealth — Full Stack
**Tim Anonymous — Universitas Mikroskil**

```
smart-health-sequelize/
├── backend/    → Express.js + Sequelize + SQLite + JWT + Swagger
└── frontend/   → React + Vite + Tailwind CSS
```

---

## Menjalankan Lokal

### Backend
```bash
cd backend
npm install
npm run dev
# → http://localhost:5000
# → http://localhost:5000/api-docs  (Swagger UI)
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

---

## Deploy

### Backend → Render / Railway
- Build command: `npm install`
- Start command: `npm start`
- Env vars: `PORT`, `JWT_SECRET`, `ALLOWED_ORIGINS`, `NODE_ENV=production`

### Frontend → Vercel / Netlify
- Build command: `npm run build`
- Output dir: `dist`
- Env var: `VITE_API_URL=https://your-backend.render.com`
