# Mymobile Backend (Golang + Gin)

Backend API untuk aplikasi Mymobile.

## Struktur

```
be/
├── main.go           # Entry point
├── go.mod
├── go.sum
├── handlers/         # Request handlers
│   └── coffee.go
├── models/           # Data models
│   └── coffee.go
└── routes/           # Route definitions
    └── routes.go
```

## Menjalankan

```bash
cd be
go run main.go
```

Server berjalan di `http://localhost:8080`

## API Endpoints

| Method | Endpoint           | Deskripsi           |
| ------ | ------------------ | ------------------- |
| GET    | `/health`          | Health check        |
| GET    | `/api/coffees`     | Daftar semua coffee |
| GET    | `/api/coffees/:id` | Detail coffee by ID |

## Contoh Request

```bash
# Health check
curl http://localhost:8080/health

# Get all coffees
curl http://localhost:8080/api/coffees

# Get coffee by ID
curl http://localhost:8080/api/coffees/1
```
