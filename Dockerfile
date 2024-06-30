FROM node:lts-bullseye-slim

EXPOSE 3000

WORKDIR /app
COPY . /app
RUN apt update && apt install -y python3 pip
RUN npm i
CMD ["npm", "start"]
