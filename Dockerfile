FROM node:current-alpine3.19


WORKDIR /app
COPY . /app
RUN apk add python3
RUN npm i
CMD ["npm", "start"]
