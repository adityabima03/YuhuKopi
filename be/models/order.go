package models

// OrderItem represents a single item in an order
type OrderItem struct {
	CoffeeID    string  `json:"coffeeId" binding:"required"`
	Name        string  `json:"name" binding:"required"`
	Description string  `json:"description"`
	Price       string  `json:"price" binding:"required"`
	Size        string  `json:"size" binding:"required"`
	Quantity    int     `json:"quantity" binding:"required,min=1"`
}

// DeliveryAddress for order
type DeliveryAddress struct {
	Street      string  `json:"street"`
	FullAddress string  `json:"fullAddress"`
	City        string  `json:"city"`
	Region      string  `json:"region"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
}

// CreateOrderRequest is the payload for creating an order
type CreateOrderRequest struct {
	Items         []OrderItem      `json:"items" binding:"required,min=1"`
	DeliveryType  string           `json:"deliveryType" binding:"required,oneof=deliver pickup"`
	Address       *DeliveryAddress `json:"address,omitempty"`
	Subtotal      float64          `json:"subtotal" binding:"required"`
	DeliveryFee   float64          `json:"deliveryFee"`
	Total         float64          `json:"total" binding:"required"`
}

// Order represents a saved order
type Order struct {
	ID           string           `json:"id"`
	Items        []OrderItem      `json:"items"`
	DeliveryType string           `json:"deliveryType"`
	Address      *DeliveryAddress `json:"address,omitempty"`
	Subtotal     float64          `json:"subtotal"`
	DeliveryFee  float64          `json:"deliveryFee"`
	Total        float64          `json:"total"`
	Status       string           `json:"status"`
}
