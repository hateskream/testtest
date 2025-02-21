# Шаг 1: Строим бинарник в контейнере
FROM docker.io/library/golang:1.23.5-alpine AS builder

WORKDIR /app

COPY go.mod ./
RUN go mod download
COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o main .


FROM scratch
WORKDIR /root/

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["/root/main"]
