package auth

import (
	"net"

	"github.com/gofiber/fiber/v3"
	utils "gitlab.dev-api.tech/data_loader_service/internal/api/api_utils"
	models "gitlab.dev-api.tech/data_loader_service/internal/domain/models/auth_service"
)

func (a *AuthController) SendVerificationCode(c fiber.Ctx) error {

	req, err := utils.ExtractJsonWithValidation[verifiactionCodeModel](c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"desc": err.Error(),
		})
	}

	data := models.VerifiactionCodeData{
		Dest:        req.Dest,
		CaptchaType: req.CaptchaType,
		Type:        req.Type,
		CheckUser:   req.UserName,
	}
	if err := a.srv.SendVerificationCode(data); err != nil {
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
