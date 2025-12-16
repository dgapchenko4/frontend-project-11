{
  "name": "@hexlet/code",
  "version": "1.0.0",
  "description": "RSS Agregator",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "build": "webpack --mode production",
    "start": "webpack serve --mode development --open",
    "dev": "webpack serve --mode development",
    "lint": "eslint .",
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@babel/core": "^7.23.9",
    "@babel/preset-env": "^7.23.9",
    "axios": "^1.6.0",
    "bootstrap": "^5.3.2",
    "core-js": "^3.33.0",
    "i18next": "^23.7.2",
    "lodash": "^4.17.21",
    "on-change": "^4.0.0",
    "yup": "^1.3.3"
  },
  "devDependencies": {
    "@babel/plugin-proposal-class-properties": "^7.18.6",
    "@babel/plugin-transform-runtime": "^7.23.9",
    "@babel/runtime": "^7.23.9",
    "@playwright/test": "^1.57.0",
    "autoprefixer": "^10.4.16",
    "babel-loader": "^9.1.3",
    "concurrently": "^9.2.1",
    "css-loader": "^6.8.1",
    "eslint": "^8.55.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.29.0",
    "html-webpack-plugin": "^5.5.4",
    "postcss-loader": "^7.3.3",
    "sass": "^1.96.0",
    "sass-loader": "^13.3.2",
    "style-loader": "^3.3.3",
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^5.2.2"
  }
}


name: Hexlet Check

on:
  push:
    branches:
      - '**'
    tags:
      - '**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Hexlet project check
        uses: hexlet/project-action@release
        with:
          hexlet-id: ${{ secrets.HEXLET_ID }}