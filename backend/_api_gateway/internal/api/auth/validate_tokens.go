package auth

import (
	"github.com/gofiber/fiber/v3"
	utils "gitlab.dev-api.tech/data_loader_service/internal/api/api_utils"
	models_auth_service "gitlab.dev-api.tech/data_loader_service/internal/domain/models/auth_service"
)

func (a *AuthController) ValidateTokens(c fiber.Ctx) error {
	accessToken, err := utils.ExtractBearerToken(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"desc": err.Error(),
		})
	}

	refreshToken, err := utils.ExtractJsonWithValidation[refreshToken](c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"desc": err.Error(),
		})
	}

	tokens := models_auth_service.Tokens{
		Access:  *accessToken,
		Refresh: refreshToken.Token,
	}

	if err := a.srv.ValidateTokens(tokens); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"desc": err,
		})

	}

	return nil
}
