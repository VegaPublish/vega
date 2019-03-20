# Vega
[![Build Status](https://travis-ci.org/VegaPublish/vega.svg?branch=master)](https://travis-ci.org/VegaPublish/vega) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# Getting started

## Prerequisites

- Node.js 8.x or later
- npm v6.0 or later

## Initialize a new Vega journal project

NOTE: This requires a backend to be up and running. Head over to the [backend repository](https://github.com/VegaPublish/saga/blob/master/README.md) for more details

The platform which Vega is built on is called `lyra`. To start, install the `lyra` command line interface:

```
npm install -g @lyra/cli
```

Then, run the setup wizard with:
```
lyra init
```
You will be prompted for the dataset of the Venue, URL for the backend API among others.

When completed, you should have a project folder with a new Vega instance.
