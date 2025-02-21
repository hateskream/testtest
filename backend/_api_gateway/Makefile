build-service-withoutDocker:
	@cd cmd && go build -o ../bin/api_gateway main.go
run-service-withoutDocker:build-service-withoutDocker
	@./bin/api_gateway --path_to_config=.env
kafka-run:
	docker-compose up -d	
proto:
	@mkdir -p ./pkg/proto/gRPC_auto_generate && protoc -I ./pkg/proto/ --go_out=./pkg/proto/gRPC_auto_generate --go-grpc_out=./pkg/proto/gRPC_auto_generate --go-grpc_opt=paths=source_relative --go_opt=paths=source_relative pkg/proto/api_gateway.proto
