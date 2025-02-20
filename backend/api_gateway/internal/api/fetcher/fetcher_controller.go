package fetcher

import (
	"github.com/go-playground/validator"
	"gitlab.dev-api.tech/data_loader_service/internal/domain/fetcher"
)

type FetcherController struct {
	fetcher   fetcher.Fetcher
	validator *validator.Validate
}

func NewFetcherController(fetcher fetcher.Fetcher) *FetcherController {
	return &FetcherController{
		fetcher:   fetcher,
		validator: validator.New(),
	}
}
