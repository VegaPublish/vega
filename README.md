# Vega

[![Build Status](https://travis-ci.org/VegaPublish/vega.svg?branch=master)](https://travis-ci.org/VegaPublish/vega) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Getting started

## Prerequisites

- Node.js 8.x or later
- npm v6.0 or later
- A running instance of Saga

You will need Node (https://nodejs.org/en/) and npm (https://www.npmjs.com/) in order to download the correct packages for Saga and Vega (and Lyra) to run.

Further, you more than likely need nvm (https://github.com/nvm-sh/nvm/blob/master/README.md) since the software is compatible with Node version 10. Why nvm? nvm lets you use older versions of Node for software that require a specific version.

## Saga, Lyra, Vega?

Saga is the backend required to run Vega. If you don't have one of those available, follow instructions in the (Saga readme)[https://github.com/VegaPublish/saga]. If setting up Saga seems like a daunting task, ask your local IT guru to do it for you :)

Vega is the editing environment which runs in the browser and makes editors happy. Lyra is the UI platform which Vega runs on.

## Initialize a new Vega instance

If you are using a newer version of Node, switch to version 10 (or version 8)
``` nvm use 10 ```

To start, install the lyra command line interface:

``` npm install -g @lyra/cli ```

Unfortunately before you can initialize a Lyra project you have to traverse to the following directory and change the directory name from example-journal to example-venue
If using nvm:
~/.nvm/versions/node/v10.10.0 (or where ever you installed the lyra cli)/lib/node_modules/@lyra/cli/templates/example-journal

If you try to select the project template Example venue (with sample plugins) while initializing your project, it will break! If you try to change the two references to example-venue in the lyra executable found in /usr/bin/lyra (or in the case of nvm ~/.nvm/versions/node/v10.10.0/bin/lyra)- the executable will break! At least in my experience (maybe it's just me).

Then, run the setup wizard with:

``` 
lyra init 
```

You will be prompted to set the following values:

```
Name of your project: yourproject
Backend API Host: http://yourIPorFQDN:4000 (if you're running a local install outside of the server, set this to http://localhost:4000)
Name of default venue (as configured in the backend): yourproject
Name of dataset for default venue: yourproject
```

## Saga

```
nvm use 10
git clone saga url from github
```

Before having the ability to access Saga, you need to set up Google OAuth with a new clientID and clientSecret. Beginning Summer 2021, Google will not allow the use of http addresses (outside of http://localhost) and redirect URIs must contain https if using a domain.

```
cd config
cp fallback.oauth.json oauth.json
```

If you would like to use Google to manage user identities within Saga, you have to travel to console.cloud.google.com/apis and set up credentials. The original code is set up to use Google OAuth - but it appears compatible with other OAuth providers.

To run Saga you also need to run node version 8 or 10. It is not compatible with newer versions of node. If you want to start up Saga, you need to run it against the version of node it is compatible with (e.g. if you npm install using node version 10, you will need to use version 10 to start it up).

When setting up a new install of Saga, the original developers require a root user. In order to set up the root user run
```
npm run setup
```

This will direct you to login with your Google account (if Google OAuth is set up) and claim the root user role. Without a root user, any user sent an invite (and not set as an admin) is unable to login.
