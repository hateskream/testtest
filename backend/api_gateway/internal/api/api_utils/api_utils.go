package api_utils

import (
	"encoding/json"
	"errors"
	"strings"

	"github.com/go-playground/validator"
	"github.com/gofiber/fiber/v3"
	"github.com/mitchellh/mapstructure"
)

var validate *validator.Validate

func InitValidator() {
	validate = validator.New()
}

func ExtractQueryParamsWithValidation[T any](ctx fiber.Ctx) (*T, error) {
	var params T

	queryParams := ctx.Queries()

	if err := mapstructure.Decode(queryParams, &params); err != nil {
		return nil, err
	}

	if err := validate.Struct(params); err != nil {
		return nil, err
	}

	return &params, nil
}

func ExtractBearerToken(ctx fiber.Ctx) (*string, error) {
	authHear := ctx.Get("Authorization")

	if strings.HasPrefix(authHear, "Bearer ") {
		token := strings.TrimPrefix(authHear, "Bearer ")
		return &token, nil
	}

	return nil, errors.New("invalid or missing Bearer token")
}

func ExtractDefaultGroups(ctx fiber.Ctx) ([]string, error) {
	header := ctx.Get("defaultGroups")
	if header == "" {
		return nil, errors.New("missing required header 'defaultGroups'")
	}

	defaultGroups := strings.Split(header, ",")

	return defaultGroups, nil
}

func ExtractJsonWithValidation[T any](ctx fiber.Ctx) (*T, error) {
	var body T

	if err := json.Unmarshal(ctx.Body(), &body); err != nil {
		return nil, err
	}

	if err := validate.Struct(body); err != nil {
		return nil, err
	}
	return &body, nil
}
