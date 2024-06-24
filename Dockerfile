FROM node:current-alpine3.19


WORKDIR /app
COPY . /app
RUN npm i websocket
CMD ["npm", "start"]