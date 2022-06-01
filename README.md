# OctusBridge frontend source code

## Installation

First, install [NodeJS](https://nodejs.org/) v16. Use [NVM](https://github.com/nvm-sh/nvm) as the best solution to manage NodeJS versions.

Next, install NPM globally. If you're using NVM - you don't need to install NPM.

```
npm intall npm -g
```

Then, install  dependencies with the command below:

```
npm ci
```

## Development

To start developing - run the command below:

```
npm start
```

It will be start Webpack Dev Server with HMR.

## Build production distributive

For build production distributive run the command below:

```
npm run build
```

It will build production-ready distributive.

## License

[AGPL v3](/LICENSE)
