package models

// Coffee represents a coffee item
type Coffee struct {
	ID              string `json:"id"`
	Name            string `json:"name"`
	Category        string `json:"category"`
	Description     string `json:"description"`
	Price           string `json:"price"`
	Rating          string `json:"rating"`
	Reviews         string `json:"reviews"`
	Image           string `json:"image"`
	FullDescription string `json:"fullDescription,omitempty"`
}
