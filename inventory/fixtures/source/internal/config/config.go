package config

// Config is the fixture root for public YAML leaves.
type Config struct {
	Server ServerConfig `yaml:"server"`
}

// ServerConfig holds the server.port leaf and one non-public field.
type ServerConfig struct {
	Port int `yaml:"port" json:"-"`
	// RuntimeOnly is excluded by yaml:"-".
	RuntimeOnly string `yaml:"-" json:"-"`
}
