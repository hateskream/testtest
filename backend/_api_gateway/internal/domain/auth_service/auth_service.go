package auth_service

import models "gitlab.dev-api.tech/data_loader_service/internal/domain/models/auth_service"

type TokensService interface {
	CreateOAuthTokens(models.CreateTokensData) (*models.Tokens, error)
	ValidateTokens(models.Tokens) error
	Authorization(string, string) (bool, error)
	RefreshAccessToken(string) (*models.Tokens, error)
}

type AuthService interface {
	TokensService
	SignUp(data models.AuthForm) error
	SignIn(redirectURI string, data models.AuthForm) (*string, error)
	LogOut(models.LogOutData) error
	SetDefaulAssigments(models.DefaultAssigmentData) error
	GetEmailAndPhone(string) (*models.UserInfo, error)
	SendVerificationCode(models.VerifiactionCodeData) error
	VerifyCode(models.VerifyCode) error
	SetPassword(models.SetPassword) error
}
