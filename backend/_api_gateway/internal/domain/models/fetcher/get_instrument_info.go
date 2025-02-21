package model_fetcher_service

import (
	ag "gitlab.dev-api.tech/data_loader_service/pkg/proto/gRPC_auto_generate"
)

type Error struct {
	Desc string `json:"desc"`
}

func NewError(err error) Error {
	return Error{
		Desc: err.Error(),
	}
}

type GetInstrumentInfo struct {
	Event       string   `json:"event" validate:"oneof=subscribe unsubscribe"`
	Instruments []string `json:"instrument" validate:"required"`
}

func (i *GetInstrumentInfo) ToProtoMsg() *ag.InstrumentsInfoRequest {
	protoMsg := ag.InstrumentsInfoRequest{
		Instruments: i.Instruments,
	}

	if i.Event == "subscribe" {
		protoMsg.Event = *ag.Event_Subscribe.Enum()
	} else {
		protoMsg.Event = *ag.Event_Unsubscribe.Enum()
	}

	return &protoMsg
}

type InstrumentInfo struct {
	Ticker            string  `json:"ticker"`
	Name              string  `json:"name"`
	Last              float64 `json:"last"`
	Change            float64 `json:"change"`
	ChangesPercentage float64 `json:"changesPercentage"`
	Volume            float64 `json:"volume"`
	RelVolume         float64 `json:"relVolume"`
	MarketCap         float64 `json:"marketCap"`
	Sector            string  `json:"sector"`
}

func ToInstrumentInfo(data *ag.InstrumentInfoResponse) InstrumentInfo {
	return InstrumentInfo{
		Ticker:            data.Ticker,
		Name:              data.Name,
		Last:              data.Last,
		Change:            data.Change,
		ChangesPercentage: data.ChangesPercentage,
		Volume:            data.Volume,
		RelVolume:         data.RelVolume,
		MarketCap:         data.MarketCap,
		Sector:            data.Sector,
	}
}
