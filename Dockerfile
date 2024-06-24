FROM node:22-alpine3.19
WORKDIR /app
COPY . /app

CMD ["npm", "start"]