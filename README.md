# Chat 6

This demo shows how to add bldg25-chat to an existing angular 6+ application

- git clone; npm install
- install redis server or obtain redistogo or redislabs server

## Pre-Launch

### Initialize redis database

- Local Redis

```bash
redis-server ./server/database/redis.conf
redis-cli -p 6379 -a this_should_be_a_secret_authcode
npm run pre-load-app-data # initializes local redis database
```

- RedisToGo

```bash
# obtain redislabs database and set up credentials
DBHOST='catfish.redistogo.com'
DBPORT=9782
DBAUTH="$(cat server/keys/redis-togo-dbauath.key)"
ts-node ./server/database/pre-load-app-data.ts --prod --dbHost $DBHOST --dbPort $DBPORT --dbAuth $DBAUTH
redis-cli -h $DBHOST -p $DBPORT -a $DBAUTH
```

- RedisLabs

```bash
# obtain redislabs database and set up credentials
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
# Creating app... done, ⬢ stormy-mountain-18015
# <https://stormy-mountain-18015.herokuapp.com/> App
# <https://git.heroku.com/stormy-mountain-18015.git> Git
git remote -v
# create Procfile
git push heroku master  # deploy to heroku
heroku ps:scale web=1   # start an instance of the app running
heroku open  # open in chrome
heroku logs --tail
heroku ps:scale web=0  # stop the running instance
heroku local web  # run the app locally
# env
heroku config:set DBHOST='redis-10568.c9.us-east-1-2.ec2.cloud.redislabs.com'
heroku config:set DBPORT=10568
heroku config:set DBAUTH="$(cat server/keys/redis-labs-dbauath.key)"
heroku config:set RSA_PUBLIC_KEY="$(cat server/keys/public.key)"
heroku config:set RSA_PRIVATE_KEY="$(cat server/keys/private.key)"
heroku config:set HOST_URL=https://stormy-mountain-18015.herokuapp.com
heroku config

git push heroku master  # commit first!
```

## NPM Module test setup

```bash
# to test modules locally - This does not work - Delete
# npm i ../bldg25-chat-dev/bldg25-chat-server-1.3.6.tgz --no-save
# npm i ../bldg25-chat-dev/bldg25-chat-1.3.6.tgz --no-save
# to test modules locally
npm i ../bldg25-chat-dev/bldg25-chat-server-1.3.6.tgz
npm i ../bldg25-chat-dev/bldg25-chat-1.3.6.tgz
# to test published modules locally
npm i bldg25-chat-server
npm i bldg25-chat
```

## TODO: Urgent

1.  Deploy to Heroku has issues with images url's and chatwebserver url
1.  Conceal redistogo key

## TODO: Normal

1.  Stopping database crashes server - Can it be auto restarted?
2.  Remove redis auth keys from code except local - auth keys only in README file for now
3.  Minify and/or uglify server code
4.  Delete images in server folder and remove image server code
5.  Add gmail oath 2.0 signup OR okta login option
6.  Final product card if it is alone stretches accross the screen
7.  Create instructions on how to use this demo app
8.  Signup should add snack bar message when it fails
9.  type files frisby and node-fetch were modified - node fetch types were removed

/home/rob/Documents/Training-GreenLanternOnly/bldg25-chat-6/bldg25-chat-demo/node_modules/@types/node-fetch/index.d.ts
/home/rob/Documents/Training-GreenLanternOnly/bldg25-chat-6/bldg25-chat-demo/node_modules/@types/frisby/index.d.ts
(line 81)export function formData(): FormData // **\*\*\*\***\*\***\*\*\*\*** modified

### Deployment Options

1.  Heroku - custom backend
2.  Others

#### Heroku

1.  Create account on Heroku
2.  Download Heroku cli
3.  Setup process.env.PORT .REDISHOST etc to configure redisdb and server.ts

```bash
heroku --version
heroku login
heroku create  # gets a random name
heroku open # opens address in chrome
# move angular/cli and angular/compiler-cli to dependencies for use by heroku
# move typescript
# move ts-node (maybe not needed if server.ts is compiled)
# script section
"postinstall": "ng build --prod"
"postinstall": "ng build --prod && ./node_modules/typescript/bin/tsc ./server/server.ts"
npm i express
# change start script to run node server; create dev start script for existing start
"start": "./node_modules/.bin/ts-node ./server/server.ts"
# or maybe compile server.ts and then run it
"start": "./node_modules/typescript/bin/tsc ./server/server.ts && node server.js"

git push heroku master  # push changes to heroku
heroku open # shortcut to go to webpage

# good idea - add engines to package.json
"engines": {
  "node": "x.x.x",
  "npm": "x.x.x"
}
```

#### Setup on Github

```bash
# - create repo
# - git remote add origin...
git remote add git-hub https://github.com/MemoryChips/bldg25-chat-demo.git
git push git-hub master

### where did these come from?
npm i -g angular-cli-ghpages
ng build --prod --base-href="https://<username>.github.io/<repository>/" # trailing / important
ngh --no-silent # maybe run with sudo
```

## Install Redis on Linux Mint

1.  download redis tar ball from [Redis.io](https://redis.io/) and unzip
2.  make
3.  make test
4.  cd /home/rob/redis-4.0.6/src/
5.  Add redis to your path so scripts can find it
6.  npm run start-redisdb
7.  redis-cli
