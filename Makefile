.PHONY: install backend frontend test run clean

install:
	@echo "Installing dependencies..."
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

backend:
	@echo "Starting FastAPI Backend..."
	cd backend && python start.py

frontend:
	@echo "Starting Vite Frontend..."
	cd frontend && npm run dev

test:
	@echo "Running pytest test suite..."
	cd backend && python -m pytest tests/

docker:
	docker-compose up --build

