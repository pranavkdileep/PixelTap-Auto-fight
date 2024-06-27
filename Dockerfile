FROM node:lts-bullseye-slim



WORKDIR /app
COPY . /app
RUN apt update && apt install python3
RUN npm i
CMD ["npm", "start"]
