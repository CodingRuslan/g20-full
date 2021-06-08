FROM node:12-alpine as build
WORKDIR /app
COPY package.json /app/package.json
#COPY package-lock.json /app/package-lock.json
RUN npm install
COPY . /app
RUN npm run build
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY casegames.ru.crt /etc/ssl/casegames.ru.crt
COPY casegames.ru.key /etc/ssl/casegames.ru.key

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
