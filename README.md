# Marketplace Platform

Nền tảng web mua bán hàng hóa (Marketplace) — Fullstack Java Spring Boot + React TypeScript.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, TanStack Query, React Router, Zustand, Tailwind CSS |
| Backend | Java 21, Spring Boot 3.3, Spring Security, JWT, Spring Data JPA, Hibernate |
| Database | PostgreSQL 16 |
| Deploy | Vercel (Frontend) + Render (Backend) |

## Getting Started

### Prerequisites

- Java 21+
- Maven 3.9+
- Node.js 20+
- PostgreSQL 16+ (hoặc Docker)

### 1. Database (Docker)

```bash
docker-compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Chỉnh sửa .env nếu cần
mvn spring-boot:run
```

API sẽ chạy tại: http://localhost:8080  
Swagger UI: http://localhost:8080/swagger-ui

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

## Project Structure

```
Marketplace-platform/
├── backend/                # Spring Boot API
│   └── src/main/java/com/marketplace/
│       ├── config/         # CORS, OpenAPI
│       ├── security/       # JWT, Spring Security
│       ├── common/         # Exception, Response, Util
│       ├── user/
│       ├── product/
│       ├── category/
│       ├── cart/
│       ├── order/
│       ├── review/
│       ├── address/
│       └── admin/
├── frontend/               # React TypeScript app
│   └── src/
│       ├── api/            # Axios instance
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── hooks/
│       ├── stores/         # Zustand state
│       ├── types/
│       ├── utils/
│       └── routes/
└── docker-compose.yml      # PostgreSQL local dev
```

## Development Phases

- [x] **Phase 1** — Project Setup
- [ ] **Phase 2** — Authentication (Register, Login, JWT)
- [ ] **Phase 3** — Category
- [ ] **Phase 4** — Product (CRUD, Search, Filter, Pagination)
- [ ] **Phase 5** — Cart
- [ ] **Phase 6** — Address
- [ ] **Phase 7** — Order & Checkout
- [ ] **Phase 8** — Seller Dashboard
- [ ] **Phase 9** — Review & Rating
- [ ] **Phase 10** — Admin Management
