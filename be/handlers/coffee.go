package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"mymobile-be/models"
)

// GetCoffees returns list of coffee items
func GetCoffees(c *gin.Context) {
	coffees := []models.Coffee{
		{
			ID:              "1",
			Name:            "Caffe Mocha",
			Category:        "Machiato",
			Description:     "Deep Foam",
			Price:           "4.53",
			Rating:          "4.8",
			Reviews:         "230",
			Image:           "/images/2.png",
			FullDescription: "A cappuccino is an approximately 150 ml (5 oz) beverage, with 25 ml of espresso coffee and 85ml of fresh milk the foaming milk is poured on top of the espresso through the spout of the steam wand.",
		},
		{
			ID:              "2",
			Name:            "Flat White",
			Category:        "Latte",
			Description:     "Espresso",
			Price:           "3.53",
			Rating:          "4.8",
			Reviews:         "189",
			Image:           "/images/3.png",
			FullDescription: "A flat white is a coffee drink consisting of espresso with microfoam. It is similar to a latte but smaller in volume and with less microfoam.",
		},
		{
			ID:              "3",
			Name:            "Caffe Latte",
			Category:        "Latte",
			Description:     "Smooth Milk",
			Price:           "3.99",
			Rating:          "4.9",
			Reviews:         "312",
			Image:           "/images/4.png",
			FullDescription: "Caffe latte is a coffee drink made with espresso and steamed milk. The term comes from the Italian caffè e latte, meaning coffee and milk.",
		},
		{
			ID:              "4",
			Name:            "Americano",
			Category:        "Americano",
			Description:     "Bold Espresso",
			Price:           "2.99",
			Rating:          "4.7",
			Reviews:         "156",
			Image:           "/images/5.png",
			FullDescription: "Caffè Americano is a type of coffee drink prepared by diluting an espresso with hot water, giving it a similar strength to but different flavor from brewed coffee.",
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"data": coffees,
	})
}

// GetCoffeeByID returns a single coffee by ID
func GetCoffeeByID(c *gin.Context) {
	id := c.Param("id")

	coffees := map[string]models.Coffee{
		"1": {
			ID:              "1",
			Name:            "Caffe Mocha",
			Category:        "Machiato",
			Description:     "Deep Foam",
			Price:           "4.53",
			Rating:          "4.8",
			Reviews:         "230",
			Image:           "/images/2.png",
			FullDescription: "A cappuccino is an approximately 150 ml (5 oz) beverage, with 25 ml of espresso coffee and 85ml of fresh milk the foaming milk is poured on top of the espresso through the spout of the steam wand.",
		},
		"2": {
			ID:              "2",
			Name:            "Flat White",
			Category:        "Latte",
			Description:     "Espresso",
			Price:           "3.53",
			Rating:          "4.8",
			Reviews:         "189",
			Image:           "/images/3.png",
			FullDescription: "A flat white is a coffee drink consisting of espresso with microfoam. It is similar to a latte but smaller in volume and with less microfoam.",
		},
		"3": {
			ID:              "3",
			Name:            "Caffe Latte",
			Category:        "Latte",
			Description:     "Smooth Milk",
			Price:           "3.99",
			Rating:          "4.9",
			Reviews:         "312",
			Image:           "/images/4.png",
			FullDescription: "Caffe latte is a coffee drink made with espresso and steamed milk. The term comes from the Italian caffè e latte, meaning coffee and milk.",
		},
		"4": {
			ID:              "4",
			Name:            "Americano",
			Category:        "Americano",
			Description:     "Bold Espresso",
			Price:           "2.99",
			Rating:          "4.7",
			Reviews:         "156",
			Image:           "/images/5.png",
			FullDescription: "Caffè Americano is a type of coffee drink prepared by diluting an espresso with hot water, giving it a similar strength to but different flavor from brewed coffee.",
		},
	}

	if coffee, ok := coffees[id]; ok {
		c.JSON(http.StatusOK, gin.H{"data": coffee})
		return
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Coffee not found"})
}
