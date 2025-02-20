package config

import (
	"log/slog"
	"os"
	"path/filepath"

	"github.com/spf13/viper"
	"gitlab.dev-api.tech/data_loader_service/internal/infrastructe/auth_state"
	"gitlab.dev-api.tech/data_loader_service/internal/infrastructe/fetcher_state"
	"gopkg.in/yaml.v2"
)

type ServiceConfig struct {
	Port                   uint   `mapstructure:"SERVICE_PORT"`
	FetcherSrvURL          string `mapstructure:"FETCHER_SERVICE_URL"`
	AuthSrvURL             string `mapstructure:"AUTH_SERVICE_URL"`
	PathToAuthServerConfig string `mapstructure:"PATH_TO_AUTH_SERVER_CONFIG"`
	LogLevel               string `mapstructure:"SERVICE_LOG_LEVEL"`
}

type authServerConfig struct {
	Certificate  string `yaml:"certificate"`
	Endpoint     string `yaml:"endpoint"`
	ClientID     string `yaml:"client_id"`
	ClientSecret string `yaml:"client_secret"`
	Organization string `yaml:"organization"`
	Application  string `yaml:"application"`
}

func LoadServiceConfig(path string) ServiceConfig {
	var config ServiceConfig

	if len(path) == 0 {
		viper.AutomaticEnv()
		//if the path to the configuration file is passed via flag (path_to_config)
	} else {
		viper.SetConfigFile(path)
		if err := viper.ReadInConfig(); err != nil {
			slog.Error("Error while read config from file", "desc", err)
			os.Exit(1)
		}
	}

	if err := viper.Unmarshal(&config); err != nil {
		slog.Error("Error while map config to struct", "desc", err)
		os.Exit(1)
	}

	return config
}

func loadAuthServerConfig(path string) (*authServerConfig, error) {
	absPath, err := filepath.Abs(path)
	if err != nil {
		return nil, err
	}

	data, err := os.ReadFile(absPath)
	if err != nil {
		return nil, err
	}

	var cfg authServerConfig
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}

func (cfg ServiceConfig) ToAuthState() *auth_state.AuthState {
	authServerConfig, err := loadAuthServerConfig(cfg.PathToAuthServerConfig)
	if err != nil {
		slog.Error("Error while map auth server config to struct", "desc", err)
		os.Exit(1)
	}

	return auth_state.NewAuthState(
		authServerConfig.Endpoint,
		authServerConfig.ClientID,
		authServerConfig.ClientSecret,
		authServerConfig.Certificate,
		authServerConfig.Organization,
		authServerConfig.Application,
	)

}

func (cfg ServiceConfig) ToFetcherState() *fetcher_state.FetcherState {
	return fetcher_state.NewFetcherState(&cfg.FetcherSrvURL)
}

func (cfg ServiceConfig) GetLogLevel() *string {
	return &cfg.LogLevel
}
