package logger

import (
	"log/slog"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func InitLogger(level *string) {
	zapLevel, err := zapcore.ParseLevel(*level)
	if err != nil {
		zapLevel = zapcore.DebugLevel
	}

	encoderConfig := zapcore.EncoderConfig{
		TimeKey:      "time",
		LevelKey:     "level",
		NameKey:      "logger",
		CallerKey:    "caller",
		FunctionKey:  zapcore.OmitKey,
		MessageKey:   "msg",
		LineEnding:   zapcore.DefaultLineEnding,
		EncodeLevel:  zapcore.LowercaseLevelEncoder,
		EncodeTime:   zapcore.ISO8601TimeEncoder,
		EncodeCaller: zapcore.ShortCallerEncoder,
	}

	cfg := zap.NewProductionConfig()
	cfg.EncoderConfig = encoderConfig
	cfg.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	cfg.Level = zap.NewAtomicLevelAt(zapLevel)
	cfg.Development = true
	cfg.Encoding = "console"
	cfg.OutputPaths = []string{"stdout"}
	cfg.ErrorOutputPaths = []string{"stdout"}

	logger, err := cfg.Build()
	if err != nil {
		slog.Error("Error while build logger", "err", err)
	}

	zap.ReplaceGlobals(logger)
}
