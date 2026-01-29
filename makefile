sinclude .env
export
BACKUP_DIR := db
DC := docker compose -f $(COMPOSE_FILE)

configure:
	@if [ ! -f .env ]; then cp .env.example .env; else echo ".env exists, skipping"; fi

build:
	$(DC) build

up:
	$(DC) up -d

down:
	$(DC) down

export-db:
	echo "db: $$db..."; \
	docker exec -t postgres \
		pg_dump -U $(POSTGRES_USER) $(POSTGRES_DB) > $(BACKUP_DIR)/$(POSTGRES_DB).sql ; \
	@echo "Done."

import-db:
	docker exec -i postgres psql -U $(POSTGRES_USER) \
		-c "DROP DATABASE IF EXISTS $(POSTGRES_DB);" ; \
	docker exec -i postgres psql -U $(POSTGRES_USER) \
		-c "CREATE DATABASE $(POSTGRES_DB);" ; \
	cat $(BACKUP_DIR)/$(POSTGRES_DB).sql | docker exec -i $(POSTGRES_CONTAINER) \
		psql -U $(POSTGRES_USER) $(POSTGRES_DB) ; \
	@echo "Done."

