package auth

import (
	"net"

	"github.com/gofiber/fiber/v3"
	utils "gitlab.dev-api.tech/data_loader_service/internal/api/api_utils"
)

func (a *AuthController) AuthMiddlware(c fiber.Ctx) error {
	token, err := utils.ExtractBearerToken(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"desc": err.Error(),
		})
	}

	resourse := c.Path()

	ok, err := a.srv.Authorization(*token, resourse)
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
	} else if !ok {
		return c.SendStatus(fiber.StatusForbidden)
	}

	return c.Next()
}
