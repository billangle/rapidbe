FROM node:16-alpine

WORKDIR /server

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 80

ENTRYPOINT ["npm", "run", "start"]