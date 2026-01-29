include .env
export

DC := docker compose -f $(COMPOSE_FILE)

configure:
	@if [ ! -f .env ]; then cp .env.example .env; else echo ".env exists, skipping"; fi

build:
	$(DC) build

up:
	$(DC) up -d

down:
	$(DC) down
