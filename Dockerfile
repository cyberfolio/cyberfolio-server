FROM node:16.15.0-alpine

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY .env.example ./
COPY .eslintrc ./
COPY .prettierrc ./
COPY package.json ./
COPY git-update.sh ./
COPY tsconfig.json ./
COPY yarn.lock ./

# copy source code to /app/src folder
COPY src /app/src

# install the app
RUN npm i -g --force yarn@1.22.19
RUN yarn

# run the app
EXPOSE 5000

CMD [ "yarn", "start" ]
