FROM node:lts-bullseye-slim



WORKDIR /app
COPY . /app
RUN npm i
CMD ["npm", "start"]
