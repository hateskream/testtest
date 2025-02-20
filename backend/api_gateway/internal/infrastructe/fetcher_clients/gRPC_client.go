package fetch_client

import (
	"context"

	"gitlab.dev-api.tech/data_loader_service/internal/domain/fetcher_client"
	ag "gitlab.dev-api.tech/data_loader_service/pkg/proto/gRPC_auto_generate"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type Client struct {
	conn   *grpc.ClientConn
	client ag.DataFetchingServiceClient
}

func NewClient(url *string) (*Client, error) {
	//TODO update options
	opts := grpc.WithTransportCredentials(insecure.NewCredentials())
	conn, err := grpc.Dial(*url, opts)
	if err != nil {
		zap.
			L().
			With(zap.String("fetcherClient", "gRPC Client")).
			Error("error while create ",
				zap.String("desc", err.Error()))

		return nil, err
	}

	grpc_client := ag.NewDataFetchingServiceClient(conn)

	client := Client{
		conn:   conn,
		client: grpc_client,
	}

	return &client, nil
}

func (c *Client) GetInstrumentsInfoStream(ctx context.Context) (fetcher_client.InstrumentsInfoStream, error) {
	stream, err := c.client.GetInstrumentsInfo(ctx)
	if err != nil {
		zap.
			L().
			With(zap.String("fetcherClient", "gRPC Client")).
			Error("error while create GetInstrumentInfoStream",
				zap.String("desc", err.Error()))

		return nil, err
	}

	return fetcher_client.InstrumentsInfoStream(stream), nil
}

func (c *Client) Close() error {
	zap.
		L().
		With(zap.String("fetcherClient", "gRPC Client")).
		Debug("stopping...")

	if err := c.conn.Close(); err != nil {
		zap.
			L().
			With(zap.String("fetcherClient", "gRPC Client")).
			Error("error while close",
				zap.String("desc", err.Error()))

		return err
	}

	zap.
		L().
		With(zap.String("fetcherClient", "gRPC Client")).
		Debug("stop completed")

	return nil
}
