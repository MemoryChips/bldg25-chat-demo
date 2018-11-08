# Chat 6

This demo shows how to add bldg25-chat to an existing angular 6+ application

See Setup Demo App below

## Develop with Mongo

- pre load users data

```bash
# run current file debug on pre-load-user-data.ts OR
node -r "ts-node/register" server/database/pre-load-user-data.ts
# reset app data using admin user to pre load app data
```

- Local development with debug server with mlab mongo

```bash
# if needed: redis-server ./server/database/redis.conf # launch local redis server
# start debug server from vs-code
npm run start
```

- Mongo Shell commands if needed

```bash
source server/keys/env-dev.sh # for dev
source server/keys/env-app.sh # for app (heroku)
mongo "mongodb+srv://dev-vejwg.mongodb.net/test" --username $MONGO_DB_ADMIN_USER -p $MONGO_DB_ADMIN_PASSWORD
mongo "mongodb+srv://dev-vejwg.mongodb.net/test" --username $MONGO_DB_USER -p $MONGO_DB_PASSWORD
```

- Run tests

```bash
# if running with some data stored in local redis server
# redis-server ./server/database/redis.conf  # ONLY if needed launch local redis server
npm run api-test
# front end tests
ng test
npm run test
```

- Local test of prod

```bash
npm outdated
npm update # to get latest published version of chat modules
npm run build # to build demo app angular code and server code
source server/keys/env-prod.sh
node dist/server.js --prod # test with Mongo only
node dist/server.js --prod --useRedisCategories  # OR test with redis categories
```

- Heroku Deploy

```bash
heroku create
git remote -v  # verify heroku remote has been added to git
# create postinstall script
# create Procfile
# good idea - add engines to package.json
# "engines": {
#   "node": "x.x.x",
#   "npm": "x.x.x"
# }
# verify build worked
# set heroku env
source server/keys/env-dev.sh
# redis config
heroku config:set REDIS_DB_HOST=$REDIS_DB_HOST
heroku config:set REDIS_DB_PORT=$REDIS_DB_PORT
heroku config:set REDIS_DB_NUM=$REDIS_DB_NUM
heroku config:set REDIS_DB_AUTHCODE=$REDIS_DB_AUTHCODE
# mongo config
heroku config:set MONGO_DATABASE=$MONGO_DATABASE
heroku config:set MONGO_URL=$MONGO_URL
# must add heroku server to the ip whitelist of Atlas
# currently for heroku whitelist all addresses
heroku config:set RSA_PUBLIC_KEY="$(cat server/keys/public.key)"
heroku config:set RSA_PRIVATE_KEY="$(cat server/keys/private.key)"
heroku config:set HOST_URL=https://stormy-mountain-18015.herokuapp.com
heroku config:set DEFAULT_AVATAR_URL=https://stormy-mountain-18015.herokuapp.com/assets/default-gravatar.jpg
heroku config

git push heroku master  # deploy to heroku. commit first!
heroku ps:scale web=1   # start an instance of the app running
heroku open  # open in chrome
heroku logs --tail
heroku ps:scale web=0  # stop the running instance
heroku local web  # run the app locally
```

## Launch Redis Version

- only redis categories is available
- TODO: setup example of using redis for the chat server

- redis install:

```bash
# download redis tar ball from [Redis.io](https://redis.io/) and unzip
make
make test
cd ~/redis-4.0.6/src/  # location of redis-server and redis-cli
# Add above dir to your path so scripts can find redis
```

### Initialize redis database(s)

- Local Redis

```bash
redis-server ./server/database/redis.conf
redis-cli -p 6379 -a this_should_be_a_secret_authcode
npm run pre-load-app-data # TODO: create Redis version
```

- Redis Shell command if needed

```bash
# to run redis shell start server as above
source server/keys/env-dev.sh
redis-cli -h $REDIS_DB_HOST -p $REDIS_DB_PORT -a $REDIS_DB_AUTHCODE -n $REDIS_DB_NUM
```

### Redis Launch Scenarios - These need updating

- Local development with debug server with local redis server

```bash
redis-server ./server/database/redis.conf # launch local redis server
# Launch server with vs-code debugger
npm start
```

- Local development with local redis server

```bash
redis-server ./server/database/redis.conf  # launch local redis server
# run server build in vs code with ctrl-shft-b
npm run start-server
npm start
```

- Local Devlopment with RedisToGo Server

```bash
source server/keys/env-dev.sh
# cntl-shft-b to build server code in vs-code
node dist/server.js --dbHost $REDIS_DB_HOST --dbPort $REDIS_DB_PORT --dbAuth $REDIS_DB_AUTHCODE -n $REDIS_DB_NUM
npm start
```

- Local test of prod with Redislabs Server (used by heroku server)

```bash
npm outdated
npm update # to get latest published version of chat modules
npm run build # to build demo app angular code and server code
# cntl-shft-b to build server in vs-code
# npm run build-server to build only server code
#
# If errors in build occur, try deleting npm_modules and npm i
#
node dist/server.js --prod --dbHost $REDIS_DB_HOST --dbPort $REDIS_DB_PORT --dbAuth $REDIS_DB_AUTHCODE -n $REDIS_DB_NUM
node dist/server.js --secure --prod --dbHost $REDIS_DB_HOST --dbPort $REDIS_DB_PORT --dbAuth $REDIS_DB_AUTHCODE -n $REDIS_DB_NUM
```

- remove all chat keys from database

```bash
redis-cli -h $REDIS_DB_HOST -p $REDIS_DB_PORT -a $REDIS_DB_AUTHCODE -n $REDIS_DB_NUM KEYS chat* | xargs redis-cli -h $REDIS_DB_HOST -p $REDIS_DB_PORT -a $REDIS_DB_AUTHCODE -n $REDIS_DB_NUM DEL
```

- Heroku Deploy - TODO: Create Heroku redis version

- Push to git hub remote

```bash
# - create repo
# - git remote add origin...
git remote add git-hub https://github.com/MemoryChips/bldg25-chat-demo.git
git push git-hub master
```

## Setup

- clone repo

```bash
git clone https://github.com/MemoryChips/bldg25-chat-demo.git
```

- Setup Keys Folder at server/keys

  - Create env-dev.sh

    ```bash
    # Atlas mongo database
    # Users
    MONGO_DB_USER='your db user'
    MONGO_DB_PASSWORD='your db user password'
    # end Users
    MONGO_DATABASE='your database name'
    MONGO_URL='url from Atlas'
    # redis to go or redis labs for example
    REDIS_DB_HOST="redis togo or redis labs host name"
    REDIS_DB_PORT="your redis provider port"
    REDIS_DB_AUTHCODE="your redis authcode"
    REDIS_DB_NUM="0"
    ```

  - cert.pem and key.pem: RSA private and public keys for running an encrypted server (https)

    - cert.pem example

      ```text
      -----BEGIN CERTIFICATE-----
      your certificate
      -----END CERTIFICATE-----
      ```

    - key.pem example

      ```text
      -----BEGIN RSA PRIVATE KEY-----
      your certificate key
      -----END RSA PRIVATE KEY-----
      ```

  - RSA private and public keys for encoding JSON webtokens

    - private.key

      ```text
      -----BEGIN RSA PRIVATE KEY-----
      your private key
      -----END RSA PRIVATE KEY-----
      ```

    - public.key

      ```text
      -----BEGIN RSA PUBLIC KEY-----
      your public key
      -----END RSA PUBLIC KEY-----
      ```

- npm install

  - confirm build works; correct any errors
  - package.lock.json will likely be modified

- add image files as desired to ./src/assets/images

  ```bash
  # cd to project dir
  # set the next line to the source of your image files
  SOURCE_OF_IMAGEFILES=../../bldg25-chat-demo/src/assets/images/*
  mkdir ./src/assets/images
  cp $SOURCE_OF_IMAGEFILES ./src/assets/images
  ```

- choose and run a launch scenario listed above

## Miscellaneous

- if needed, clear debug process using port 9000 that failed to terminate

  ```bash
  lsof -i tcp:9000
  kill <pid of process using port 9000>
  ```
