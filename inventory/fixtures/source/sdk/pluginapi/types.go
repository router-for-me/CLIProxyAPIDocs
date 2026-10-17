package pluginapi

import "context"

// AuthProvider is the plugin auth hook exercised by the fixture.
type AuthProvider interface {
	ParseAuth(context.Context, AuthParseRequest) (AuthParseResponse, error)
}
