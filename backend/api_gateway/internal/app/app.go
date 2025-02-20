package app

import (
	"flag"
	"os"
	"os/signal"
	"syscall"

	"gitlab.dev-api.tech/data_loader_service/config"
	"gitlab.dev-api.tech/data_loader_service/internal/api/api_utils"
	"gitlab.dev-api.tech/data_loader_service/internal/api/auth"
	"gitlab.dev-api.tech/data_loader_service/internal/api/fetcher"
	"gitlab.dev-api.tech/data_loader_service/internal/logger"
	"gitlab.dev-api.tech/data_loader_service/internal/server"
)

func parseFlagsForRun() string {
	pathToConfig := flag.String("path_to_config", "", "path to file with config for service")
	flag.Parse()

	return *pathToConfig
}

func Run() {
	pathToConfig := parseFlagsForRun()
	cfg := config.LoadServiceConfig(pathToConfig)

	logger.InitLogger(cfg.GetLogLevel())

	api_utils.InitValidator()

	authState := cfg.ToAuthState()
	authController := auth.NewAuthController(authState)

	fetcherState := cfg.ToFetcherState()
	fetcherController := fetcher.NewFetcherController(fetcherState)

	server := server.New(authController, fetcherController)

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt, syscall.SIGTERM)

	go func() {
		server.Start(cfg.Port)
	}()

	<-interrupt

	server.Stop()
}
