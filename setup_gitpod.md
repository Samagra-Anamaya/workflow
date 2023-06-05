# Setup gitpod to change in code and run on live server

## By using npm

1. cd/apps

   cd/wrapper

2. run docker ps

   copy CONTAINER ID of wrapper

3. run docker stop ID(copied on step2)

4. run docker rm ID(copied on step2)

5. run docker images

   copy IMAGE ID of wrapper

6. docker rmi ID(copied on step5)

7. make .env in wrapper directory

8.  REACT_APP_ENKETO_URL=COPY REACT_APP_ENKETO_URL FROM .env (main directory-WORKFLOW)

    REACT_APP_FORM_MANAGER_URL=COPY REACT_APP_FORM_MANAGER_URL FROM .env (main directory-WORKFLOW)
    
    REACT_APP_HASURA_URL=COPY REACT_APP_HASURA_URL FROM .env (main directory-WORKFLOW)


9.  npm i --legacy-peer-deps
10. npm audit fix --force(1 or 2 times)

11. npm run start
