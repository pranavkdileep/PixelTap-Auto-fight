FROM node:current-alpine3.19


WORKDIR /app
COPY . /app
RUN apt install python3 -y
RUN npm i
CMD ["npm", "start"]
