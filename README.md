# TakeMe

Веб-приложение для организации совместных поездок сотрудников в офис.

## Стек
- Backend: NestJS, Prisma, PostgreSQL
- Frontend: React, TypeScript, Redux Toolkit (RTK Query), React Router
- Карты: Leaflet, OpenStreetMap, OSRM

## Запуск
1. `docker compose up -d` — поднять базу данных
2. Из TakeMe сделать:
```bash
   1. cd backend
   2. npm i
   3. npm run start:dev
   ```
3. Открыть второй терминал сделать:
```bash
   1. cd frontend
   2. npm i
   3. npm run dev
   ```