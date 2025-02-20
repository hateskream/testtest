package auth

import (
	"net"

	"github.com/gofiber/fiber/v3"
	"gitlab.dev-api.tech/data_loader_service/internal/api/api_utils"
	models_auth_service "gitlab.dev-api.tech/data_loader_service/internal/domain/models/auth_service"
)

func (a *AuthController) SignUp(c fiber.Ctx) error {
	body, err := api_utils.ExtractJsonWithValidation[authFormModel](c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"desc": err.Error(),
		})
	}

	data := models_auth_service.AuthForm{
		UserName:       body.UserName,
		Password:       body.Password,
		Email:          body.Email,
		Phone:          body.Phone,
		Confirm:        body.Confirm,
		InvitationCode: body.InvitationCode,
	}

	if data.InvitationCode == "" {
		//TODO set default code from config
		data.InvitationCode = "default_code"
	}

	if err := a.srv.SignUp(data); err != nil {
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
