package fetcher_client

import (
	"context"
	"io"

	ag "gitlab.dev-api.tech/data_loader_service/pkg/proto/gRPC_auto_generate"
)

type InstrumentsInfoStream ag.DataFetchingService_GetInstrumentsInfoClient

type FetcherClient interface {
	io.Closer
	GetInstrumentsInfoStream(context.Context) (InstrumentsInfoStream, error)
}
