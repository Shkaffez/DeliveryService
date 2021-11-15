FROM node:latest
WORKDIR /var/www

COPY ./package*.json /var/www/
RUN npm install

COPY ./src/utils /var/www/
COPY ./src/middleware /var/www/
COPY ./src/models /var/www/
COPY ./src/index.js /var/www/
COPY ./src/controller /var/www/
COPY ./src/routes /var/www/

EXPOSE 3000

CMD ["npm", "start"]

