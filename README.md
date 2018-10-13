# Chat 6

This demo shows how to add bldg25-chat to an existing angular 6+ application

- git clone
- npm install
- install redis server or obtain redistogo or redislabs credentials

```bash
# download redis tar ball from [Redis.io](https://redis.io/) and unzip
make
make test
cd ~/redis-4.0.6/src/  # location of redis-server and redis-cli
# Add above dir to your path so scripts can find redis
```

## Pre-Launch

### Add Files not committed in the Repo

#### Add Key Files to ./server/keys Folder

- cert.pem and key.pem: RSA private and public keys for running an encrypted server (https)
- private.key and public.key: RSA private and public keys for encoding JSON webtokens
- redis-labs-dbauth.key: Auth key for redis-labs
- redis-togo-dbauth.key: Auth key for redistogo

#### Add Image Files to ./src/assets/images as desired

## Initialize redis database(s)

- Local Redis

```bash
redis-server ./server/database/redis.conf
redis-cli -p 6379 -a this_should_be_a_secret_authcode
npm run pre-load-app-data # initializes local redis database
```

- RedisToGo

```bash
# obtain RedisToGo database and set up credentials
DBHOST='catfish.redistogo.com'
DBPORT=9782
DBAUTH="$(cat server/keys/redis-togo-dbauath.key)"
ts-node ./server/database/pre-load-app-data.ts --prod --dbHost $DBHOST --dbPort $DBPORT --dbAuth $DBAUTH
redis-cli -h $DBHOST -p $DBPORT -a $DBAUTH
```

- RedisLabs

```bash
# obtain RedisLabs database and set up credentials
DBHOST='redis-10568.c9.us-east-1-2.ec2.cloud.redislabs.com'
DBPORT=10568
DBAUTH="$(cat server/keys/redis-labs-dbauath.key)"
ts-node ./server/database/pre-load-app-data.ts --prod --dbHost $DBHOST --dbPort $DBPORT --dbAuth $DBAUTH
redis-cli -h $DBHOST -p $DBPORT -a $DBAUTH
```

## Launch - Mongo

- pre load users data

```bash
# run current file debug on pre-load-user-data.ts OR
node -r "ts-node/register" server/database/pre-load-user-data.ts
# reset app data using admin user
```

- Local development with debug server with mlab mongo

```bash
# if running with some data stored in local redis server
redis-server ./server/database/redis.conf # launch local redis server
mongo ds031541.mlab.com:31541/my-world-robt -u 'chat-dev' -p 6j7u6ihhrb # optional
# start debug server from vs-code
npm run start
```

```bash
# to run mongo shell on mlab demo database
mongoDbUser='chat-demo-user'
mongoDbPassword='xi3bye949h'
mongoDbLocation='ds223653.mlab.com:23653' # note: no @
mongoDataBase='chat-demo'
mongo $mongoDbLocation/$mongoDataBase -u $mongoDbUser -p $mongoDbPassword
# start debug server from vs-code
npm run start
```

```bash
# if running with some data stored in local redis server
redis-server ./server/database/redis.conf # launch local redis server
redis-cli -p 6379 -a this_should_be_a_secret_authcode # optional
```

- Run tests

```bash
# if running with some data stored in local redis server
redis-server ./server/database/redis.conf  # launch local redis server
npm run start-server # launch api server OR run vs-code debugger
npm run api-test
```

## Launch Scenarios - Redis - These need updating

- Local development with debug server with local redis server

```bash
redis-server ./server/database/redis.conf # launch local redis server
redis-cli -p 6379 -a this_should_be_a_secret_authcode # optional
# Launch server with vs-code debugger
npm start
```

- Local development with local redis server

```bash
redis-server ./server/database/redis.conf  # launch local redis server
redis-cli -p 6379 -a this_should_be_a_secret_authcode # optional
# run server build in vs code with ctrl-shft-b
npm run start-server
npm start
```

- Local Devlopment with RedisToGo Server

```bash
DBHOST='catfish.redistogo.com'
DBPORT=9782
DBAUTH="$(cat server/keys/redis-togo-dbauath.key)"
redis-cli -h $DBHOST -p $DBPORT -a $DBAUTH
# cntl-shft-b to build server code in vs-code
node dist/server.js --dbHost $DBHOST --dbPort $DBPORT --dbAuth $DBAUTH
npm start
```

- Local test of prod with Redislabs Server

```bash
npm outdated
npm update # to get latest published version of chat modules
npm run build # to build demo app angular code and server code
DBHOST='redis-10568.c9.us-east-1-2.ec2.cloud.redislabs.com'
DBPORT=10568
DBAUTH="$(cat server/keys/redis-labs-dbauath.key)"
# redis-cli -h $DBHOST -p $DBPORT -a $DBAUTH # optional
# cntl-shft-b to build server in vs-code
# npm run build-server to build only server code
#
# If errors in build occur, try deleting npm_modules and npm i
#
node dist/server.js --prod --dbHost $DBHOST --dbPort $DBPORT --dbAuth $DBAUTH
node dist/server.js --secure --prod --dbHost $DBHOST --dbPort $DBPORT --dbAuth $DBAUTH
```

- remove all chat keys from database

```bash
DBHOST='redis-10568.c9.us-east-1-2.ec2.cloud.redislabs.com'
DBPORT=10568
DBAUTH="$(cat server/keys/redis-labs-dbauath.key)"
# OR
DBHOST='catfish.redistogo.com'
DBPORT=9782
DBAUTH="$(cat server/keys/redis-togo-dbauath.key)"
redis-cli -h $DBHOST -p $DBPORT -a $DBAUTH KEYS chat* | xargs redis-cli -h $DBHOST -p $DBPORT -a $DBAUTH DEL
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
heroku config:set DBHOST='redis-10568.c9.us-east-1-2.ec2.cloud.redislabs.com'
heroku config:set DBPORT=10568
heroku config:set DBAUTH="$(cat server/keys/redis-labs-dbauath.key)"
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

### Setup on Github

```bash
# - create repo
# - git remote add origin...
git remote add git-hub https://github.com/MemoryChips/bldg25-chat-demo.git
git push git-hub master
```

### Setup Demo App

- clone repo at git@bitbucket.org:robkat/chat-5.git
- run npm install

  - confirm build works; correct any errors
  - package.lock.json will likely be modified

- Add Key Files not committed to repo to ./server/keys Folder
  - cert.pem and key.pem: RSA private and public keys for running an encrypted server (https)
  - private.key and public.key: RSA private and public keys for encoding JSON webtokens
  - redis-labs-dbauth.key: Auth key for redis-labs
  - redis-togo-dbauth.key: Auth key for redistogo

```bash
# cd to project dir
# set the next line to the source of your key files
# TODO: set up example set of files
SOURCE_OF_KEYFILES=../../bldg25-chat-demo/server/server/keys
mkdir ./server/keys/.
cp $SOURCE_OF_KEYFILES ./server/keys
```

- add image files as desired to ./src/assets/images

```bash
# cd to project dir
# set the next line to the source of your image files
# TODO: set up example set of files
SOURCE_OF_IMAGEFILES=../../bldg25-chat-demo/src/assets/images/*
mkdir ./src/assets/images
cp $SOURCE_OF_IMAGEFILES ./src/assets/images
```

- choose and run a launch scenario listed above
