package auth

import (
	"net"

	"github.com/gofiber/fiber/v3"
	"gitlab.dev-api.tech/data_loader_service/internal/api/api_utils"
	models_auth_service "gitlab.dev-api.tech/data_loader_service/internal/domain/models/auth_service"
)

func (a *AuthController) SetDefaulAssigments(c fiber.Ctx) error {
	weebHookData, err := api_utils.ExtractJsonWithValidation[webHookData](c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	data := models_auth_service.DefaultAssigmentData{
		UserName: weebHookData.UserName,
	}

	err = a.srv.SetDefaulAssigments(data)
	if err != nil {
		var statusCode int
		switch err.(type) {
		case net.Error:
			statusCode = fiber.StatusInternalServerError
		default:
			statusCode = fiber.StatusBadRequest
		}

		return c.Status(statusCode).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return nil
}
