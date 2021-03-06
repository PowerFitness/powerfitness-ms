FROM node:12-alpine3.12

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]