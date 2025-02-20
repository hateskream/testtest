package auth

type authFormModel struct {
	SignInMethod string `json:"signinMethod,omitempty"`
	Method       string `json:"method,omitempty"`
	Type         string `json:"type,omitempty"`
	State        string `json:"state,omitempty"`
	Provider     string `json:"provider,omitempty"`
	RedirectURI  string `json:"redirectURI,omitempty"`

	UserName       string `json:"username,omitempty"`
	Password       string `json:"password,omitempty"`
	Confirm        string `json:"confirm,omitempty"`
	Email          string `json:"email,omitempty"`
	Phone          string `json:"phone,omitempty"`
	Code           string `json:"code,omitempty"`
	InvitationCode string `json:"invitationCode,omitempty"`
}

type verifiactionCodeModel struct {
	Dest        string `json:"dest"`
	CaptchaType string `json:"captchaType"`
	Type        string `json:"type"`
	UserName    string `json:"userName"`
}

type verifyCodeModel struct {
	Code       string `json:"code" validate:"required"`
	Identifier string `query:"identifier" validate:"required"`
}

type setPasswordModel struct {
	UserName    string `json:"userName"`
	NewPassword string `json:"newPassword"`
}

type urlParams struct {
	RedirectURI string `query:"redirectURI" validate:"required"`
}

type Identifier struct {
	Identifier string `query:"identifier" validate:"required"`
}

type refreshToken struct {
	Token string `json:"refresh_token" validate:"required"`
}

type createTokensParams struct {
	Code string `query:"code" validate:"required"`
}

type webHookData struct {
	UserName string `json:"user" validate:"required"`
}
