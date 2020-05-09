# Vega

[![Build Status](https://travis-ci.org/VegaPublish/vega.svg?branch=master)](https://travis-ci.org/VegaPublish/vega) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Getting started

## Prerequisites

* Node.js 8.x or later
* npm v6.0 or later
* A running instance of Saga

## Saga, Lyra, Vega?

**Saga** is the backend required to run Vega. If you don't have one of those available, follow instructions in the [Saga readme](https://github.com/VegaPublish/saga). If setting up Saga seems like a daunting task, ask your local IT guru to do it for you :)

**Vega** is the editing environment which runs in the browser and makes editors happy.
**Lyra** is the UI platform which Vega runs on.

## Initialize a new Vega instance

The platform which Vega is built on is called `lyra`. To start, install the `lyra` command line interface:

```
npm install -g @lyra/cli
```

Then, run the setup wizard with:

```
lyra init
```

You will be prompted for the dataset name associated with the Venue, the URL for the Saga backend API, and a couple of other things. Follow the instructions.

When completed, you have have a project folder with a new Vega instance. `cd` to that folder and run `lyra start`. Then open your browser and point it to the URL prompted to you in the terminal.

Congratulations, you have Vega running!
