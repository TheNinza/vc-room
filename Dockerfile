# CREATE THE SERVER
FROM node:lts-alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

# expose ports in docker-compose.yaml if needed or uncomment the following line
# EXPOSE 8000

CMD [ "npm", "start" ]

