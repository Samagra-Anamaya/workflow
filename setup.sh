#!/bin/bash

read -r -p "Is Docker, Node, Python installed on your system? [y/n]: " response

# If response is No then ask them to install else Go further
if [[ "$response" =~ ^[Nn]$ ]]; then
  echo -e "Please install the required packages:-\n   1. Docker\n   2. Node\n   3. Python"
else
  # Run docker containers and build the packages
  docker-compose up -d --build

  # Check if docker-compose command was successful
  if [ $? -eq 0 ]; then
    echo "Success: Docker containers built successfully."

    # Get the ID of the 'wrapper' container
    wrapper_id=$(docker ps -aqf "name=wrapper")
    echo "Wrapper Container ID = $wrapper_id"

    # Stop and remove wrapper container
    docker stop "$wrapper_id" >/dev/null && docker rm "$wrapper_id" >/dev/null
    echo "Success: Wrapper Container stopped and removed."

    # Change directory app/wrapper
    cd apps/wrapper

    # Add env to the .env file
    {
      echo "REACT_APP_ENKETO_URL=http://localhost:8065"
      echo "REACT_APP_FORM_MANAGER_URL=http://localhost:3006"
      echo "REACT_APP_HASURA_URL=http://localhost:8080"
    } >>.env

    echo "Created .env file in apps/wrapper directory."

    # Check if pnpm is installed or not
    if ! command -v pnpm &>/dev/null; then
      echo "pnpm is not installed. Installing pnpm..."

      # Install pnpm using npm
      npm install -g pnpm

      if [ $? -eq 0 ]; then
        echo "pnpm installed successfully."

      else
        echo "Error: Failed to install pnpm."
        exit 1
      fi
    else
      echo "pnpm is already installed."
    fi

    # Installing dependencies
    pnpm i

    echo "Success: All dependencies are installed."
    echo -e "\n Success: All dependencies are installed. \nRun this command to start the live server \n   pnpm run start\n"

  else
    echo "Error: Failed to build Docker containers."
  fi
fi
