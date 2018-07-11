# Chat5

```bash
REDIS_DB_AUTHCODE=this_should_be_a_secret_authcode
# AUTH this_should_be_a_secret_authcode
```

## TODO: Urgent

1.  type files frisby and node-fetch were modified

## TODO: Normal

1.  Delete images in server folder and remove image server code
1.  Add gmail oath 2.0 signup
1.  Final product card if it is alone stretches accross the screen
1.  Create instructions on how to use this demo app
1.  Signup should add snack bar message when it fails

## Development Notes

Old ts-node server start commands

```bash
#    "start-server-ts-node": "./node_modules/.bin/ts-node ./server/server.ts",
#    "start-server-ts-node-secure": "./node_modules/.bin/ts-node ./server/server.ts --secure",
#    "start-server-prod-ts-node": "./node_modules/.bin/ts-node ./server/server.ts --secure --prod",
```

- git clone; npm install
- install redis server

```bash
npm start # ng serve
npm run start-redisdb # start development redis server
# optional start redis server with unique path to executable
/home/rob/redis-4.0.8/src/redis-server ./server/database/redis.conf
# run debugger version of server setup in vs-code of server
# OR run server from command line:
npm run start-server # start express server written in typescript
redis-cli # optional start redis-cli; requires AUTH <key> to use

# converting pug files
pug client/src/app/chat/activator/activator.component.pug -P
pug *.pug -P  # cd to directory
```

```bash
VERSION=1.0.5
npm i ../bldg25-chat-dev/bldg25-chat-$VERSION.tgz
npm i ../bldg25-chat-dev/bldg25-chat-server-$VERSION.tgz
```

### CLI commands

```bash
# edit .angular-cli.json to change app to chat for prefix
ng g c chat/components/BroadcastMessage -d
ng g s chat/ChatMessage -d
ng g c chat/components/Main -d
ng g c chat/components/Windows -d
ng g c chat/components/Activator -d
ng g c chat/components/Tabs -d
ng g c chat/components/RoomCard -d
```

### chat server diff commands

zdiff chat-server/database/chat-redis.ts ../bldg25-chat-dev/chat-server/database/chat-redis.ts
zdiff chat-server/web-socket-server.ts ../bldg25-chat-dev/chat-server/web-socket-server.ts
zdiff chat-server/chat-server.ts ../bldg25-chat-dev/chat-server/chat-server.ts

zdiff chat-server/server-config.ts ../bldg25-chat-dev/chat-server/server-config.ts

## Deployment Notes

1.  Minification
2.  Uglification
3.  Bundling
4.  Dead code elimination
5.  AOT compilation

- navbar background color changed to blue in development

```bash
ng build --prod
```

### Deployment Options

1.  GitHub Pages - no backend
2.  Firebase - front and backend
3.  Heroku - custom backend

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
git push origin master
npm i -g angular-cli-ghpages
ng build --prod --base-href="https://<username>.github.io/<repository>/" # trailing / important
ngh --no-silent # maybe run with sudo
```

#### Setup on Firebase

- create app in google firebase site

```bash
npm i -g firebase-tools
firebase login # opens a browser window
firebase init
# firebase.json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
ng build --prod
firebase deploy
#
```

## Firebase

firebase.google.com

Currently firebase is locked to version 4.8.0 in the client. Review the need for this.

```html
<script src="https://www.gstatic.com/firebasejs/4.8.0/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDBRr35JOKFmxv84LfQi89vpHklgfjrT-8",
    authDomain: "chat-5-firebase.firebaseapp.com",
    databaseURL: "https://chat-5-firebase.firebaseio.com",
    projectId: "chat-5-firebase",
    storageBucket: "chat-5-firebase.appspot.com",
    messagingSenderId: "1036420277755"
  };
  firebase.initializeApp(config);
</script>
```

## Install Redis on Linux Mint

1.  download redis tar ball and unzip in somewhere in home dir from [Redis.io](https://redis.io/)
2.  make
3.  make test
4.  cd /home/rob/redis-4.0.6/src/
5.  Add redis to your path so scripts can find it
6.  npm run start-redisdb
7.  redis-cli

### install redis client for node

1.  npm i redis

## Preload data

Upload pre-load.json to firebase

## Angular CLI setup

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
