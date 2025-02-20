package auth

import (
	"net"

	"github.com/gofiber/fiber/v3"
	utils "gitlab.dev-api.tech/data_loader_service/internal/api/api_utils"
	models "gitlab.dev-api.tech/data_loader_service/internal/domain/models/auth_service"
)

func (a *AuthController) LogOut(c fiber.Ctx) error {
	accessToken, err := utils.ExtractBearerToken(c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"desc": err.Error(),
		})
	}

	data := models.LogOutData{
		AccessToken: *accessToken,
	}

	err = a.srv.LogOut(data)
	if err != nil {
		var statusCode int

		switch err.(type) {
		case net.Error:
			statusCode = fiber.StatusInternalServerError
		default:
			statusCode = fiber.StatusBadRequest
		}

		return c.Status(statusCode).JSON(fiber.Map{
			"desc": err.Error(),
		})
	}

	return nil
}
