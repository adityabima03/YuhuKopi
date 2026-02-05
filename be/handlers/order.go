package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"mymobile-be/models"
	"mymobile-be/storage"
)

// CreateOrder handles POST /api/orders
func CreateOrder(c *gin.Context) {
	var req models.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	// Validate delivery address when type is deliver
	if req.DeliveryType == "deliver" && req.Address == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Address required for delivery"})
		return
	}

	order := models.Order{
		ID:           uuid.New().String(),
		Items:        req.Items,
		DeliveryType: req.DeliveryType,
		Address:      req.Address,
		Subtotal:     req.Subtotal,
		DeliveryFee:  req.DeliveryFee,
		Total:        req.Total,
		Status:       "pending",
	}

	if err := storage.SaveOrder(order); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan pesanan"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data": gin.H{
			"id":           order.ID,
			"items":        order.Items,
			"deliveryType": order.DeliveryType,
			"subtotal":     order.Subtotal,
			"deliveryFee":  order.DeliveryFee,
			"total":        order.Total,
			"status":       order.Status,
		},
		"message": "Order berhasil dibuat",
	})
}

// GetOrders returns list of orders from JSON file
func GetOrders(c *gin.Context) {
	orders, err := storage.LoadOrders()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memuat pesanan"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": orders})
}
