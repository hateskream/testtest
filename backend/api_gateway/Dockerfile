FROM alpine:3.21
WORKDIR /app
COPY bin/api_gateway .
COPY .env . # ???
CMD ["./api_gateway", "--path_to_config=.env"]