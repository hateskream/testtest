package fetcher_state

import (
	"gitlab.dev-api.tech/data_loader_service/internal/domain/fetcher_client"
	client "gitlab.dev-api.tech/data_loader_service/internal/infrastructe/fetcher_clients"
)

type FetcherState struct {
	url *string
}

func NewFetcherState(url *string) *FetcherState {
	return &FetcherState{
		url: url,
	}
}

func (s *FetcherState) GetFectherClient() (fetcher_client.FetcherClient, error) {
	return client.NewClient(s.url)
}
