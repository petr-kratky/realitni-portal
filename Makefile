all:
	docker-compose -f docker-compose.master.yml up --build -d
apollo:
	docker-compose -f docker-compose.apollo.yml up --build -d
