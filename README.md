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

- private.key and public.key: RSA private and public keys for running an encrypted server (https)
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

## Launch Scenarios

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
DBHOST='redis-10568.c9.us-east-1-2.ec2.cloud.redislabs.com'
DBPORT=10568
DBAUTH="$(cat server/keys/redis-labs-dbauath.key)"
redis-cli -h $DBHOST -p $DBPORT -a $DBAUTH # optional
npm run build # to build demo app angular code and server code
# cntl-shft-b to build server in vs-code
# npm run build-server to build only server code
node dist/server.js --secure --prod --dbHost $DBHOST --dbPort $DBPORT --dbAuth $DBAUTH
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

## TODO: Urgent

## TODO: Normal

1.  Can I update tslint?
1.  Autoprefixer is used by webpack. Can I remove it from the project dependencies?
1.  Stopping database crashes server - Can it be auto restarted?
1.  Add gmail oath 2.0 signup OR okta login option
1.  Final product card if it is alone stretches accross the screen
1.  Signup should add snack bar message when it fails
1.  type files frisby and node-fetch were modified - node fetch types were removed

/home/rob/Documents/Training-GreenLanternOnly/bldg25-chat-6/bldg25-chat-demo/node_modules/@types/node-fetch/index.d.ts
/home/rob/Documents/Training-GreenLanternOnly/bldg25-chat-6/bldg25-chat-demo/node_modules/@types/frisby/index.d.ts
(line 81)export function formData(): FormData // **\*\*\*\***\*\***\*\*\*\*** modified

### Setup on Github

```bash
# - create repo
# - git remote add origin...
git remote add git-hub https://github.com/MemoryChips/bldg25-chat-demo.git
git push git-hub master
```
