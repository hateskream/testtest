package auth_state

import (
	"encoding/json"
	"fmt"

	"github.com/casdoor/casdoor-go-sdk/casdoorsdk"
	"github.com/segmentio/ksuid"
	models "gitlab.dev-api.tech/data_loader_service/internal/domain/models/auth_service"
)

type AuthState struct {
	client *casdoorsdk.Client
}

func NewAuthState(
	endpoint string,
	clientId string,
	clientSecret string,
	certificate string,
	organizationName string,
	applicationName string,
) *AuthState {
	client := casdoorsdk.NewClient(endpoint, clientId, clientSecret, certificate, organizationName, applicationName)

	return &AuthState{
		client: client,
	}
}

func (s *AuthState) SetDefaulAssigments(data models.DefaultAssigmentData) error {
	code := ksuid.New().String()
	invitationName := fmt.Sprintf("%s_invitation", data.UserName)
	invitation := models.Invitation{
		Application: s.client.ApplicationName,
		Code:        code,
		DefaultCode: code,
		Name:        invitationName,
		DisplayName: invitationName,
		Owner:       s.client.OrganizationName,
		Quota:       10000000,
		State:       "Active",
		//TODO config default group
		Group: "i88_dev/cfd_platform_users_without_sub",
	}

	invitationBytes, err := json.Marshal(invitation)
	if err != nil {
		return err
	}

	_, err = s.client.DoPost("add-invitation", nil, invitationBytes, false, false)
	if err != nil {
		return err
	}

	return nil
}

func (s *AuthState) CreateOAuthTokens(params models.CreateTokensData) (*models.Tokens, error) {
	state := s.client.OrganizationName
	oAuthTokens, err := s.client.GetOAuthToken(params.Code, state)
	if err != nil {
		return nil, err
	}
	tokens := models.Tokens{
		Access:  oAuthTokens.AccessToken,
		Refresh: oAuthTokens.RefreshToken,
	}

	return &tokens, nil
}

func (s *AuthState) ValidateTokens(tokens models.Tokens) error {

	var err models.ValidateTokensErr

	_, accessErr := s.client.ParseJwtToken(tokens.Access)
	if accessErr != nil {
		err.AccessErr = accessErr.Error()
	}

	_, refreshErr := s.client.ParseJwtToken(tokens.Refresh)
	if refreshErr != nil {
		err.RefreshErr = refreshErr.Error()
	}

	if err.AccessErr == "" && err.RefreshErr == "" {
		return nil
	}

	return &err
}

func (s *AuthState) Authorization(token string, resourse string) (bool, error) {
	claims, err := s.client.ParseJwtToken(token)
	if err != nil {
		return false, err
	}

	owner := claims.Owner

	role := claims.Roles[0].Name

	permission := claims.Permissions[0]

	permissionId := fmt.Sprintf("%s/%s", owner, permission.Name)

	body := []interface{}{
		fmt.Sprintf("%s/%s", owner, role),
		resourse,
	}

	ok, err := s.client.Enforce(permissionId, "", "", "", "", casdoorsdk.CasbinRequest(body))
	if err != nil {
		return false, err
	}

	return ok, nil
}

func (s *AuthState) RefreshAccessToken(refreshToken string) (*models.Tokens, error) {
	oAuthTokens, err := s.client.RefreshOAuthToken(refreshToken)
	if err != nil {
		return nil, err
	}

	tokens := models.Tokens{
		Access:  oAuthTokens.AccessToken,
		Refresh: oAuthTokens.RefreshToken,
	}

	return &tokens, nil
}

func (s *AuthState) SignUp(data models.AuthForm) error {

	data.Application = s.client.ApplicationName
	data.Organization = s.client.OrganizationName

	body, err := json.Marshal(data)
	if err != nil {
		return nil
	}

	_, err = s.doPost("signup", nil, body, false, false)

	if err != nil {
		return err
	}
	return nil
}

func (s *AuthState) SignIn(redirectURI string, data models.AuthForm) (*string, error) {
	data.Application = s.client.ApplicationName
	data.State = s.client.ApplicationName
	data.Type = "code"

	queryMap := map[string]string{
		"clientId":     s.client.ClientId,
		"responseType": "code",
		"redirectUri":  redirectURI,
	}

	postByte, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	resp, err := s.doPost("login", queryMap, postByte, false, false)
	if err != nil {
		return nil, err
	}

	code := fmt.Sprintf("%v", resp.Data)

	return &code, nil
}

func (s *AuthState) LogOut(data models.LogOutData) error {
	queryMap := map[string]string{
		"id_token_hint": data.AccessToken,
		"state":         s.client.OrganizationName,
	}

	_, err := s.doPost("logout", queryMap, nil, false, false)
	if err != nil {
		return err
	}
	return nil
}

func (s *AuthState) GetEmailAndPhone(identifier string) (*models.UserInfo, error) {
	queryMap := map[string]string{
		"organization": s.client.OrganizationName,
		"username":     identifier,
	}

	url := s.client.GetUrl("get-email-and-phone", queryMap)
	resp, err := s.client.DoGetResponse(url)
	if err != nil {
		return nil, err
	}

	respBytes, err := json.Marshal(resp.Data)
	if err != nil {
		return nil, err
	}

	var response models.UserInfo

	if err := json.Unmarshal(respBytes, &response); err != nil {
		return nil, err
	}

	return &response, nil
}

func (s *AuthState) SendVerificationCode(data models.VerifiactionCodeData) error {
	data.ApplicationId = fmt.Sprintf("admin/%s", s.client.ApplicationName)

	postBytes, err := json.Marshal(data)
	if err != nil {
		return err
	}

	_, err = s.client.DoPost("send-verification-code", nil, postBytes, true, false)
	if err != nil {
		return err
	}

	return nil
}

func (s *AuthState) VerifyCode(data models.VerifyCode) error {

	data.Application = s.client.ApplicationName
	data.Organization = s.client.OrganizationName
	data.Type = "login"

	postByte, err := json.Marshal(data)
	if err != nil {
		return err
	}

	_, err = s.client.DoPost("verify-code", nil, postByte, false, false)
	if err != nil {
		return err
	}

	return nil
}

func (s *AuthState) SetPassword(data models.SetPassword) error {
	result, err := s.client.SetPassword(s.client.OrganizationName, data.UserName, "", data.NewPassword)
	if err != nil {
		fmt.Println(result)
		return err
	}

	fmt.Println(result)

	return nil
}
