FROM node:current-alpine
WORKDIR /app
COPY package*.json ./
RUN ls -al
RUN npm install

COPY . .

EXPOSE 5000
CMD [ "npm", "run", "start:prod" ]
