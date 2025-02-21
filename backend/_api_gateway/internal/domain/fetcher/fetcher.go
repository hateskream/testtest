package fetcher

import "gitlab.dev-api.tech/data_loader_service/internal/domain/fetcher_client"

type Fetcher interface {
	GetFectherClient() (fetcher_client.FetcherClient, error)
}
