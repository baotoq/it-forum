FROM node:8.5.0
WORKDIR /src
COPY . .
EXPOSE 4200
RUN npm install
ENTRYPOINT ["npm", "start"]