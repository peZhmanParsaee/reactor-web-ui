# Reactor Web UI

Reactor is a super tiny invoice management application. This code repository is its `Web UI` source code which has been developed by [React](https://reactjs.org/) and [Material UI](https://material-ui.com). Moreover, there is an API for Reactor which is located in [Reactor API Code Repository](https://github.com/pezhmanparsaee/reactor-api)

## Demo
![Reactor Demo](https://raw.githubusercontent.com/pezhmanparsaee/reactor-web-ui/master/reactor-demo.gif)

## Popular dependencies

* React
* Redux
* Material UI
* Express
* Webpack
* Babel
* Moment

## Prerequisites

* Clone [Reactor API Code Repository](https://github.com/pezhmanparsaee/reactor-api)
and run it based on instructions. Reactor Web UI depends on Reactor API.
* Run `npm insatll` in your cli in the root of project to install dependencies
* Make a copy of `.env.sample` and name it `.env`. You might have a tendency to change the environemt variables on it. It is vital that the API_ENDPOINT env variable set correctly to the address of running API.

## How To Run in Development Mode

* Run `npm run dev-server`. 
* Watch through the logs of this command, you must see the running http address
* Open up your browser and enter running http adderss to see web output

## How To Run in Production Mode

* Run `npm run build:prod`. 
* Run `npm start`. 
* Open up your browser and enter running http adderss to see web output. The default port is 3000.

## Available Scripts

In the project folder, you can run these shell commands:

### `npm install`
It installs all npm modules that are required for running the application.

### `npm run dev-server`
It compiles React codes of the project and runs a development web server for seeing the output in a web browser in development mode

### `npm run build:dev`
This script compiles the source code that is suitable for development mode.

### `npm run build:prod`
This script compiles the source code that is suitable for production mode.

### `npm start`
It runs a node web server that serves the output and responds to HTTP requests. It is proper to run a production builded codes. So you need to build the source code before running this command.
