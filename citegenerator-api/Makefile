COMPOSE ?= docker compose

.PHONY: dev build deploy logs down restart status validate

help:
	@echo "Commands:"
	@echo "  make dev       - Run API locally (pnpm dev)"
	@echo "  make build     - Build docker images"
	@echo "  make deploy    - Deploy with docker compose"
	@echo "  make logs      - Tail logs"
	@echo "  make down      - Stop services"
	@echo "  make status    - Show status + health"

dev:
	pnpm install
	pnpm dev

build:
	$(COMPOSE) build --no-cache

validate:
	@test -f .env || (echo "ERROR: .env missing (cp .env.example .env)"; exit 1)

deploy: validate build
	$(COMPOSE) up -d
	@sleep 3
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f --tail=200

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart

status:
	$(COMPOSE) ps
	@echo ""
	@curl -s http://127.0.0.1:3000/api/health || true

