FROM node:16.11.1

# Create app directory
WORKDIR /usr/app

COPY package*.json ./
RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
