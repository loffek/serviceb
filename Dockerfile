FROM node:8.12.0

RUN mkdir /app
WORKDIR /app
ADD main.js ./
ADD test.sh ./

CMD ["node", "main.js"]
