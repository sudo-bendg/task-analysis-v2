FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx tsc -p src/tsconfig.json

CMD ["npm", "run", "start"]