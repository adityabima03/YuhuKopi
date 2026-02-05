# Mymobile Backend (Golang + Gin)

Backend API untuk aplikasi Mymobile.

## Struktur

```
be/
├── main.go           # Entry point
├── go.mod
├── go.sum
├── data/             # JSON storage (auto-created)
│   └── orders.json  # Daftar pesanan
├── handlers/
│   ├── coffee.go
│   └── order.go
├── models/
│   ├── coffee.go
│   └── order.go
├── storage/          # Penyimpanan JSON
│   └── orders.go
└── routes/
    └── routes.go
```

## Menjalankan

```bash
cd be
go run main.go
```

Server berjalan di `http://localhost:8080`

## API Endpoints

| Method | Endpoint           | Deskripsi                    |
| ------ | ------------------ | ---------------------------- |
| GET    | `/health`          | Health check                 |
| GET    | `/api/coffees`     | Daftar semua coffee          |
| GET    | `/api/coffees/:id` | Detail coffee by ID          |
| POST   | `/api/orders`      | Buat pesanan baru            |
| GET    | `/api/orders`      | Daftar pesanan (placeholder) |

## Contoh Request

```bash
# Health check
curl http://localhost:8080/health

# Get all coffees
curl http://localhost:8080/api/coffees

# Get coffee by ID
curl http://localhost:8080/api/coffees/1

# Create order (POST)
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"coffeeId":"1","name":"Caffe Mocha","description":"Deep Foam","price":"4.53","size":"M","quantity":2}],"deliveryType":"pickup","subtotal":9.06,"deliveryFee":0,"total":9.06}'
```
