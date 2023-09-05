FROM node:18-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* ./
RUN yarn install

COPY . .
EXPOSE 3000
CMD yarn dev