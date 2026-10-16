package api

import "testing"

func TestRegisterRoutes(t *testing.T) {
	v1 := engine.Group("/v1")
	v1.GET("/extracted-from-test", handler)
}
