[![travis](https://img.shields.io/travis/christian-fei/open-weather-map-cli.svg?style=flat-square)](https://travis-ci.org/christian-fei/open-weather-map-cli) [![npm-version](https://img.shields.io/npm/v/open-weather-map-cli.svg?style=flat-square&colorB=007EC6)](https://www.npmjs.com/package/open-weather-map-cli) [![npm-dependencies](https://img.shields.io/badge/dependencies-none-blue.svg?style=flat-square&colorB=44CC11)](package.json) [![standard-js](https://img.shields.io/badge/coding%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/) [![npm-license](https://img.shields.io/npm/l/open-weather-map-cli.svg?style=flat-square&colorB=007EC6)](https://spdx.org/licenses/ISC)

> unobtrusive weather report in the terminal

![open-weather-map-cli.png](https://github.com/christian-fei/open-weather-map-cli/blob/master/open-weather-map-cli.png)

## installation

```
npm install -g open-weather-map-cli
```

## configuration

set `OPEN_WEATHER_MAP_API_KEY` in the ENV. grab one if you need an api key https://home.openweathermap.org/api_keys 📖

## usage

`open-weather-map-cli [Place name]`

```
open-weather-map-cli Rome
> 🏡  Rome
> 📖  Clear, clear sky
> ☀️  right now
```