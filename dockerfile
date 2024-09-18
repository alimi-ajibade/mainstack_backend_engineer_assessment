# Base image
FROM node:current-slim
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm install -g typescript
RUN npm install -g shx
RUN npm run build
EXPOSE 8000
CMD [ "npm", "start"]
