FROM node:alpine

# Create app directory
WORKDIR /app
COPY ./package.json ./
RUN npm install --only=prod
COPY . .

CMD [ "npm", "start" ]