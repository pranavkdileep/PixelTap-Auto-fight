FROM node:lts-bullseye-slim



WORKDIR /app
COPY . /app
RUN apk add python3
RUN npm i
CMD ["npm", "start"]
