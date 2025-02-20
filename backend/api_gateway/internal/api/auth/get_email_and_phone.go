package auth

import (
	"net"

	"github.com/gofiber/fiber/v3"
	utils "gitlab.dev-api.tech/data_loader_service/internal/api/api_utils"
)

func (a *AuthController) GetEmailAndPhone(c fiber.Ctx) error {
	params, err := utils.ExtractQueryParamsWithValidation[Identifier](c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"desc": err.Error(),
		})
	}

	resp, err := a.srv.GetEmailAndPhone(params.Identifier)
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

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"userName": resp.UserName,
		"email":    resp.Email,
		"phone":    resp.Phone,
	})

}
