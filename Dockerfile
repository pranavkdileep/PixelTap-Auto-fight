FROM node:22-alpine3.19
WORKDIR /app
COPY . /app
RUN npm install
CMD ["npm", "start"]