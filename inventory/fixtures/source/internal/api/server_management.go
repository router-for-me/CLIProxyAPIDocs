package api

func (s *Server) registerManagementRoutes() {
	mgmt := s.engine.Group("/v0/management")
	mgmt.GET("/config", s.mgmt.GetConfig)
}
