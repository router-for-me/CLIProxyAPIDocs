package api

func (s *Server) registerRoutes() {
	v1 := s.engine.Group("/v1")
	v1.POST("/chat/completions", openaiHandlers.ChatCompletions)
}
