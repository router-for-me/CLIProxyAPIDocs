package api

func (s *Server) registerManagementV8Routes() {
	v8 := s.engine.Group("/v8/management")
	v8.GET("/config", s.mgmt.ConfigV8)
}
