package auth

import (
	authSrv "gitlab.dev-api.tech/data_loader_service/internal/domain/auth_service"
)

type AuthController struct {
	srv authSrv.AuthService
}

func NewAuthController(srv authSrv.AuthService) *AuthController {

	return &AuthController{
		srv: srv,
	}
}
