FROM node:lts-bullseye-slim



WORKDIR /app
COPY . /app
RUN apt update && apt install python3 -y
RUN yarn add
CMD ["npm", "start"]
