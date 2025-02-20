package auth

import (
	"net"

	"github.com/gofiber/fiber/v3"
	utils "gitlab.dev-api.tech/data_loader_service/internal/api/api_utils"
)

func (a *AuthController) RefreshAccessToken(c fiber.Ctx) error {
	refreshToken, err := utils.ExtractJsonWithValidation[refreshToken](c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"desc": err.Error(),
		})
	}

	tokens, err := a.srv.RefreshAccessToken(refreshToken.Token)
	if err != nil {
		var statusCode int

		switch err.(type) {
		case net.Error:
			statusCode = fiber.StatusInternalServerError
		default:
			statusCode = fiber.StatusUnauthorized
		}

		return c.Status(statusCode).JSON(fiber.Map{
			"desc": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"access_token":  tokens.Access,
		"refresh_token": tokens.Refresh,
	})
}
