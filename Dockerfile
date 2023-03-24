# syntax=docker/dockerfile:1

FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "preview"]
EXPOSE 3000
