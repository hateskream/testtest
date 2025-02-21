package server

import (
	"fmt"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/gofiber/fiber/v3/middleware/recover"

	"github.com/rlapenok/contrib/websocket"
	"gitlab.dev-api.tech/data_loader_service/internal/api/auth"
	"gitlab.dev-api.tech/data_loader_service/internal/api/fetcher"
	"go.uber.org/zap"
)

type Server struct {
	app *fiber.App
}

func New(authController *auth.AuthController, fetcherController *fetcher.FetcherController) *Server {
	cfg := fiber.Config{
		ReadBufferSize: 64 * 1024,
	}

	app := fiber.New(cfg)

	app.Use(recover.New())
	app.Use(corsMiddleware())
	app.Use(logger.New())

	api := app.Group("/api")

	apiV1 := api.Group("/v1")

	authGroup := apiV1.Group("/auth")
	authGroup.Post("/signup", authController.SignUp)
	authGroup.Post("/signin", authController.SignIn)
	authGroup.Post("/logout", authController.LogOut)
	authGroup.Post("/set_default_assigments", authController.SetDefaulAssigments)
	authGroup.Get("/create_tokens", authController.CreateTokens)
	authGroup.Post("/validate_tokens", authController.ValidateTokens)
	authGroup.Post("/refresh_tokens", authController.RefreshAccessToken)
	authGroup.Get("/get_email_and_phone", authController.GetEmailAndPhone)
	authGroup.Post("/send_verification_code", authController.SendVerificationCode)
	authGroup.Post("/verify_code", authController.VerifyCode)
	authGroup.Post("/set_password", authController.SetPassword)

	adminGroup := apiV1.Group("/admin")
	adminGroup.Use(authController.AuthMiddlware)
	adminGroup.Get("/some_handler", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"info": "info only for admins",
		})
	})

	fetcherGroup := apiV1.Group("/fetcher")
	//fetcherGroup.Use(authController.AuthMiddlware)

	fetcherFreeGroup := fetcherGroup.Group("/free")
	fetcherFreeGroup.Get("/some_free_handler", func(c fiber.Ctx) error {
		return nil
	})
	ffgRealTime := fetcherFreeGroup.Group("/real_time")
	ffgRealTime.Use(WsMiddleware)
	ffgRealTime.Get("/get_instruments_info", websocket.New(fetcherController.GetInstrumentInfo))

	fetcherPaidGroup := fetcherGroup.Group("/paid")
	fetcherPaidGroup.Get("/some_paid_handler", func(c fiber.Ctx) error {
		return nil
	})

	return &Server{
		app: app,
	}
}

func (s *Server) Start(port uint) {
	if err := s.app.Listen(fmt.Sprintf(":%d", port)); err != nil {
		zap.L().Error("error while start starting server", zap.String("desc", err.Error()))
	}
}

func (s *Server) Stop() {

	zap.L().Info("service received shutdown signal")

	if err := s.app.Shutdown(); err != nil {
		zap.L().Error("error while stopiing server", zap.String("desc", err.Error()))
	}

	zap.L().Info("service successfully stopped")

}
