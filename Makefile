build:
	docker build -t loffek/serviceb .

start: build
	docker run -it -p 8000:8000 -e PORT=8000 loffek/serviceb

test: build
	docker run loffek/serviceb ./test.sh
