# Expense Tracker API

NestJS API for tracking personal expenses with per-user data isolation, JWT authentication, advanced querying, and summary reports.

---

## Features
- User registration, login, and JWT authentication
- CRUD for expenses (per-user)
- Pagination, sorting, and filtering
- Summary reports (total, per-category, monthly)
- Secure password hashing
- Global response structure
- Comprehensive Swagger API docs

---

## Getting Started (with Docker)

### 1. **Clone the repository**
```bash
git clone https://github.com/omar-salama/expense-tracker.git
cd expense-tracker
```

### 2. **Configure Environment Variables**
Copy the example environment file and edit it as needed:
```bash
cp .env.example .env
```
Edit `.env` to match your local setup. See comments in `.env.example` for details.

> **Note:** The `DB_HOST` should match the service name in your `docker-compose.yml` (commonly `db`).

### 3. **Start the Application with Docker Compose**
```bash
docker-compose up --build
```
This will build and start both the API and the PostgreSQL database. All dependencies are handled by Docker.

### 4. **Access the API and Swagger Docs**
- API base URL: [http://localhost:3000/api](http://localhost:3000/api)
- Swagger docs: [http://localhost:3000/api/docs](http://localhost:3000/api)

---

## Authentication
- Register: `POST /auth/register`
- Login: `POST /auth/login` (returns JWT)
- Use the JWT as a Bearer token for all protected endpoints.

---

## Expenses Endpoints
- `POST /expenses` — Create expense
- `GET /expenses` — List expenses (pagination, sorting, filtering)
- `GET /expenses/:id` — Get single expense
- `PUT /expenses/:id` — Update expense
- `DELETE /expenses/:id` — Delete expense

All expense operations are **per-user** (JWT required).

---

## Summary Reports
- `GET /expenses/reports/summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
  - Returns: total spent, per-category totals, monthly breakdown
  - All fields are optional; defaults to all user expenses

**Example response:**
```json
{
  "total": 1234.56,
  "perCategory": [
    { "category": "Food", "total": 500 },
    { "category": "Transport", "total": 200 }
  ],
  "monthly": [
    { "month": "2024-06", "total": 300 },
    { "month": "2024-07", "total": 934.56 }
  ]
}
```

---

## Project Structure
- `src/expenses/` — Expense entity, service, controller, DTOs, enums
- `src/auth/` — Auth module, JWT, guards, user decorators
- `src/users/` — User entity, service, DTOs
- `src/common/` — Shared decorators, interceptors, response DTOs

---

## Best Practices
- All sensitive fields (e.g., password) are excluded from API responses
- DTOs and enums are organized for clarity and reusability
- Modules are decoupled and follow NestJS best practices
- Global response structure for consistency

---

## Contributing
Pull requests are welcome! Please follow the existing code style and best practices.

---

## License
MIT
