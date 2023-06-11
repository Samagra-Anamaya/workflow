---
sidebar_position: 1
---

# Setup and Installation

## System Requirements

The primary requirements of the project include [**NodeJS**](https://nodejs.org/en/) and [**Docker**](https://www.docker.com/). Multiple `node` versions have been used and hence it is recommended that you have the latest version of `NVM - Node Version Manager` installed on your computer. A `.nvmrc` file will be added to every directory in order to make sure that the current `node` version is being used to build it.

:::info

**Recommended :** NPM version (6.14.15) and Node version (v14.18.1) and Ubuntu OS version (18.04)
Your machine should have [Yarn](https://yarnpkg.com/) / [NPM](https://www.npmjs.com/) & [Python](https://www.python.org/) installed.

You can check your `node` and `npm` versions by running the following commands

```
node -v
npm -v
```

:::

## Installation

In order to make the process of getting started with the project as easy and seamless as possible, we have a single command setup for enabling fast and convenient setup.

👉 Fork the repository to get your own copy by clicking on the [Fork](https://github.com/Samagra-Development/workflow/fork) button.

👉 Clone the forked repository to your local machine. And Navigate the root directory of repository.

```bash
git clone https://github.com/{YOUR_USERNAME}/workflow
cd workflow
```

👉 Change the enviroment variables in sample.env or .env file as shown below. It will use the locally created containers and connect to those services.

```bash
REACT_APP_ENKETO_URL=http://localhost:8065
REACT_APP_FORM_MANAGER_URL=http://localhost:3006
REACT_APP_HASURA_URL=http://localhost:8080
```

👉 Start the docker services

```sh
docker-compose up -d --build
```

👉 Stop and remove the container of React app named `wrapper` to see live changes in the application

```sh
docker ps -aqf "name=wrapper"
# Use the output `<id>` to stop the wrapper container.
docker stop <id> && docker rm <id>
```

👉 Navigate to the wrapper directory.

```sh
cd apps\wrapper\
```

👉 Using pnpm to install dependencies and run the app live

```sh
pnpm install
pnpm run start
```

👉 The repository is structured as a **monorepo** managed using [**Turborepo**](https://turborepo.org/) in order to cache and speed up builds, create pipelines and enabling the concurrent execution of scripts, all of which result in an improved Developer Experience (DX). Active work continues on this and progress can be tracked [**here**](https://github.com/Samagra-Development/workflow)

:::info

For local development enketo-express needs node 14 and pnpm@7. Run nvm use 14 && `npm i -g pnpm@7` if developing in enketo-express

:::

:::tip

Make sure you have `Docker` installed on your system as some of the packages depend on underlying docker containers. The team is currently planning to shift all servers to containers. You can track the progress on this migration [here](https://github.com/Samagra-Development/workflow/issues/14)

:::
