FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

ENTRYPOINT ["/usr/src/app/bin/docker-entrypoint"]
CMD [ "npm", "run", "dev" ]
