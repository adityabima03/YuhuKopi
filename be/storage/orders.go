package storage

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"

	"mymobile-be/models"
)

const ordersFile = "data/orders.json"

var mu sync.RWMutex

func loadOrdersUnlocked() ([]models.Order, error) {
	data, err := os.ReadFile(ordersFile)
	if err != nil {
		if os.IsNotExist(err) {
			return []models.Order{}, nil
		}
		return nil, err
	}

	var orders []models.Order
	if err := json.Unmarshal(data, &orders); err != nil {
		return nil, err
	}
	return orders, nil
}

// LoadOrders reads all orders from JSON file
func LoadOrders() ([]models.Order, error) {
	mu.RLock()
	defer mu.RUnlock()
	return loadOrdersUnlocked()
}

// SaveOrder appends a new order to the JSON file
func SaveOrder(order models.Order) error {
	mu.Lock()
	defer mu.Unlock()

	orders, err := loadOrdersUnlocked()
	if err != nil {
		return err
	}

	orders = append(orders, order)

	if err := os.MkdirAll(filepath.Dir(ordersFile), 0755); err != nil {
		return err
	}

	data, err := json.MarshalIndent(orders, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(ordersFile, data, 0644)
}
