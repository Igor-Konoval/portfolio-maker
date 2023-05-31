# Используйте базовый образ Node.js
FROM node:14

# Установите рабочую директорию внутри контейнера
WORKDIR /app

# Скопируйте файл package.json и package-lock.json
COPY package*.json ./

# Установите зависимости проекта
RUN npm install

# Создайте директорию для приложения
RUN mkdir -p /app/views/modules

# Скопируйте файлы проекта внутрь контейнера
COPY . .

# Указать порт, на котором работает ваше приложение
EXPOSE 3000

# Запустите приложение
CMD [ "npm", "start" ]
