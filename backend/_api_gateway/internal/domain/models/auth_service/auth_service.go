package models_auth_service

import "fmt"

var (
	ErrAccessTokenValidation  = fmt.Errorf("error while validating accessToken")
	ErrRefreshTokenValidation = fmt.Errorf("error while validating refreshToken")
)

type AuthForm struct {
	Application  string `json:"application"`
	Organization string `json:"organization,omitempty"`

	SignInMethod string `json:"signinMethod,omitempty"`
	Method       string `json:"method,omitempty"`
	Type         string `json:"type,omitempty"`
	State        string `json:"state,omitempty"`
	Provider     string `json:"provider,omitempty"`
	RedirectURI  string `json:"redirectUri,omitempty"`

	UserName       string `json:"username,omitempty"`
	Password       string `json:"password,omitempty"`
	Confirm        string `json:"confirm,omitempty"`
	Email          string `json:"email,omitempty"`
	Phone          string `json:"phone,omitempty"`
	Code           string `json:"code,omitempty"`
	InvitationCode string `json:"invitationCode,omitempty"`
}

type UserInfo struct {
	UserName string `json:"name"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
}

type VerifiactionCodeData struct {
	Dest          string `json:"dest"`
	CaptchaType   string `json:"captchaType"`
	Type          string `json:"type"`
	ApplicationId string `json:"applicationId"`
	CheckUser     string `json:"checkUser"`
}

type VerifyCode struct {
	Application  string `json:"application"`
	Code         string `json:"code"`
	Organization string `json:"organization"`
	Type         string `json:"type"`
	Username     string `json:"username"`
}

type SetPassword struct {
	UserName    string
	NewPassword string
}

type LogOutData struct {
	AccessToken string
}

type CreateTokensData struct {
	Code string
}

type DefaultAssigmentData struct {
	UserName string
}

type Tokens struct {
	Access  string
	Refresh string
}

type Invitation struct {
	Application string `json:"application"`
	Code        string `json:"code"`
	DefaultCode string `json:"defaultCode"`
	Name        string `json:"name"`
	DisplayName string `json:"displayName"`
	Owner       string `json:"owner"`
	Quota       int    `json:"quota"`
	State       string `json:"state"`
	UsedCount   int    `json:"usedCount"`
	Group       string `json:"signupGroup"`
}

type ValidateTokensErr struct {
	AccessErr  string `json:"access_err"`
	RefreshErr string `json:"refresh_err"`
}

func (e *ValidateTokensErr) Error() string {
	var msg string
	if e.AccessErr != "" && e.RefreshErr != "" {
		msg = fmt.Sprintf("access_token_error: %v, refresh_token_error: %v", e.AccessErr, e.RefreshErr)
	} else if e.AccessErr != "" {
		msg = fmt.Sprintf("access_token_error: %v", e.AccessErr)
	} else if e.RefreshErr != "" {
		msg = fmt.Sprintf("refresh_token_error: %v", e.RefreshErr)
	}

	return msg
}
