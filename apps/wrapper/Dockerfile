#get the latest alpine image from node registry
FROM node:16-alpine AS build-stage
RUN npm i -g pnpm
#set the working directory
WORKDIR /app

#copy the package and package lock files
#from local to container work directory /app
COPY package.json /app/
COPY pnpm-lock.yaml /app/

#Run command npm install to install packages
RUN pnpm install

#copy all the folder contents from local to container & build
FROM node:lts as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build

#specify env variables at runtime
FROM node:lts as runner
WORKDIR /app
ARG NEXT_PUBLIC_ENKETO_URL
ARG NEXT_PUBLIC_FORM_MANAGER_URL
ARG NEXT_PUBLIC_HASURA_URL
ARG NEXT_PUBLIC_USER_SERVICE_URL
ARG NEXT_PUBLIC_APPLICATION_ID

ENV NEXT_PUBLIC_ENKETO_URL $NEXT_PUBLIC_ENKETO_URL
ENV NEXT_PUBLIC_FORM_MANAGER_URL $NEXT_PUBLIC_FORM_MANAGER_URL
ENV NEXT_PUBLIC_HASURA_URL $NEXT_PUBLIC_HASURA_URL
ENV NEXT_PUBLIC_USER_SERVICE_URL $NEXT_PUBLIC_USER_SERVICE_URL
ENV NEXT_PUBLIC_APPLICATION_ID $NEXT_PUBLIC_APPLICATION_ID
ENV NODE_ENV production

# If you are using a custom next.config.js file, uncomment this line.
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]