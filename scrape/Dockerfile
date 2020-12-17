FROM node:current-buster
WORKDIR /app
COPY package*.json ./
RUN npm install -g typescript
RUN npm install

COPY . .

CMD [ "npm", "run", "prod" ]
