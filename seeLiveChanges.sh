#!/bin/bash

image_name="wrapper"

container_id=$(docker ps -qf "ancestor=$image_name")

echo "container Id = $container_id"

docker stop "$container_id" && docker rm "$container_id"

echo "container stopped and removed"

cp .env apps/wrapper/

echo "Environment variables copied"
cd apps/wrapper
npm i --legacy-peer-deps

echo "Dependecies Installed running the server"
# Dependecies Installed running the server
npm run start

# Open localhost:3000 in web browser
if [[ "$OSTYPE" == "darwin"* ]]; then
  open "http://localhost:3000"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  xdg-open "http://localhost:3000"
else
  echo "Unsupported operating system."
fi