package fetcher

import (
	"context"
	"sync"

	"github.com/go-playground/validator"
	"github.com/rlapenok/contrib/websocket"
	"gitlab.dev-api.tech/data_loader_service/internal/domain/fetcher_client"
	models "gitlab.dev-api.tech/data_loader_service/internal/domain/models/fetcher"
	"go.uber.org/zap"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (f *FetcherController) GetInstrumentInfo(conn *websocket.Conn) {
	zap.
		L().
		With(zap.String("handler", "get_instrument_info")).
		Info("new ws connection")

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	client, err := f.fetcher.GetFectherClient()
	if err != nil {
		err := models.NewError(err)

		if err := conn.WriteJSON(err); err != nil {
			zap.
				L().
				With(zap.String("handler", "get_instrument_info")).
				Error("error send response to client", zap.String("desc", err.Error()))
		}

		return
	}

	stream, err := client.GetInstrumentInfoStream(ctx)

	if err != nil {
		err := models.NewError(err)

		if err := conn.WriteJSON(err); err != nil {
			zap.
				L().
				With(zap.String("handler", "get_instrument_info")).
				Error("error send response to client", zap.String("desc", err.Error()))
		}

		return
	}

	wg := sync.WaitGroup{}

	closeChan := make(chan struct{}, 1)

	conn.SetCloseHandler(func(code int, text string) error {
		zap.
			L().
			With(zap.String("handler", "get_instrument_info")).
			Info("ws connection closed by client",
				zap.String("text", text),
				zap.Int("code", code))

		if err := client.Close(); err != nil {
			return err
		}

		closeChan <- struct{}{}

		return nil
	})

	wg.Add(1)
	go func() {
		defer wg.Done()

		recvFromClient(conn, stream, f.validator)
	}()

	for {
		select {
		case <-closeChan:
			close(closeChan)

			wg.Wait()

			if err := conn.Close(); err != nil {
				zap.
					L().
					With(zap.String("handler", "get_instrument_info")).
					Error("error while close WS connection", zap.String("desc", err.Error()))
			}

			return
		default:
			sendToClient(conn, stream)
		}
	}
}

func recvFromClient(conn *websocket.Conn, stream fetcher_client.InstrumentsInfoStream, validator *validator.Validate) {
	for {
		var msg models.GetInstrumentInfo

		if err := conn.ReadJSON(&msg); err != nil {
			if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway, websocket.CloseNoStatusReceived) {
				break
			}

			zap.
				L().
				With(zap.String("handler", "get_instrument_info")).
				Error("error while read msg from client", zap.String("desc", err.Error()))

			resp := models.NewError(err)

			if err := conn.WriteJSON(resp); err != nil {
				zap.
					L().
					With(zap.String("handler", "get_instrument_info")).
					Error("error send response to client", zap.String("desc", err.Error()))
			}

			continue
		}

		if err := validator.Struct(msg); err != nil {
			err := models.NewError(err)

			if err := conn.WriteJSON(err); err != nil {
				zap.
					L().
					With(zap.String("handler", "get_instrument_info")).
					Error("error send response to client", zap.String("desc", err.Error()))
			}
		}

		if err := stream.Send(msg.ToProtoMsg()); err != nil {
			zap.
				L().
				With(zap.String("handler", "get_instrument_info")).
				Error("error send request to fetcherService", zap.String("desc", err.Error()))
		}

	}
}

func sendToClient(conn *websocket.Conn, stream fetcher_client.InstrumentsInfoStream) {
	data, err := stream.Recv()

	if err != nil {
		if status, ok := status.FromError(err); ok && status.Code() == codes.Canceled {
			return
		}

		zap.
			L().
			With(zap.String("handler", "get_instrument_info")).
			Error("error recv response from fetcherService", zap.String("desc", err.Error()))

		return
	}

	instrumentInfo := models.ToInstrumentInfo(data)

	if err := conn.WriteJSON(instrumentInfo); err != nil {
		zap.
			L().
			With(zap.String("handler", "get_instrument_info")).
			Error("error send response to client", zap.String("desc", err.Error()))
	}
}
