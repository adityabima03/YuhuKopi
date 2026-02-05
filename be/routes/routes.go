package routes

import (
	"github.com/gin-gonic/gin"
	"mymobile-be/handlers"
)

// Setup configures all API routes
func Setup(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.GET("/coffees", handlers.GetCoffees)
		api.GET("/coffees/:id", handlers.GetCoffeeByID)
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})
}
