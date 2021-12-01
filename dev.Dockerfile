ARG build-dev
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm config set registry http://200.198.29.90:8081/repository/npm/
RUN npm install
COPY . .
RUN npm run build -- --mode dev
RUN echo "Build number: $build-dev"

# 
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]