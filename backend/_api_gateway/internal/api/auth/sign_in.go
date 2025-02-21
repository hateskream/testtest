package auth

import (
	"net"

	"github.com/gofiber/fiber/v3"
	utils "gitlab.dev-api.tech/data_loader_service/internal/api/api_utils"
	models_auth_service "gitlab.dev-api.tech/data_loader_service/internal/domain/models/auth_service"
)

func (a *AuthController) SignIn(c fiber.Ctx) error {
	params, err := utils.ExtractQueryParamsWithValidation[urlParams](c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"desc": err.Error(),
		})
	}

	body, err := utils.ExtractJsonWithValidation[authFormModel](c)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"desc": err.Error(),
		})
	}

	data := models_auth_service.AuthForm{
		UserName:       body.UserName,
		Email:          body.Email,
		Phone:          body.Phone,
		Password:       body.Password,
		SignInMethod:   body.SignInMethod,
		Code:           body.Code,
		Method:         body.Method,
		Provider:       body.Provider,
		RedirectURI:    body.RedirectURI,
		InvitationCode: body.InvitationCode,
	}
	code, err := a.srv.SignIn(params.RedirectURI, data)
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
		"code": code,
	})

}
