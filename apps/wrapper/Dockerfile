FROM node:lts as dependencies
WORKDIR /app
COPY . ./
RUN yarn

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
