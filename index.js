#!/usr/bin/env node

const { get } = require('https')

if (require.main === module) {
  const place = process.argv[2] || 'Trento'
  main(place, process.env.OPEN_WEATHER_MAP_API_KEY || process.env.npm_config_open_weather_map_api_key)
} else {
  module.exports = {
    main,
    weatherFor,
    toBuffer,
    toString,
    toWeather,
    toReport
  }
}

function main (place, apiKey = process.env.npm_config_open_weather_map_api_key) {
  weatherFor(place, apiKey)
    .then(toReport)
    .then(printReport)
}

function weatherFor (place, apiKey = process.env.npm_config_open_weather_map_api_key) {
  return new Promise((resolve, reject) => {
    get(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apiKey}`, res => {
      toString(res, (err, string) => {
        if (err) return reject(err)
        if (!string) return reject(string)
        try {
          const json = JSON.parse(string)
          const weather = toWeather(json)
          resolve(weather)
        } catch (err) {
          console.error(`an error happened: ${err.message}`, err, string)
        }
      })
    })
  })
}

function toBuffer (stream, fn, chunks = []) {
  stream.on('error', err => fn(err))
  stream.on('data', chunk => chunks.push(chunk))
  stream.on('end', data => fn(null, Buffer.concat(chunks)))
}

function toString (stream, fn) {
  return toBuffer(stream, (err, buffer) => {
    if (err) return fn(new Error(err))
    fn(null, buffer.toString())
  })
}

function toWeather (json) {
  const toCondition = json => ({
    type: json.weather[0].main,
    description: json.weather[0].description
  })

  return {
    place: json.name,
    condition: toCondition(json)
  }
}

function toReport (weather) {
  const { condition } = weather
  const conditionReport = toConditionReport(weather)

  const acc = []
  acc.push(`🏡  ${weather.place}`)
  acc.push(`📖  ${condition.type}, ${condition.description}`)
  acc.push(...conditionReport)

  return acc
}

function toConditionReport (weather) {
  const acc = []
  const { condition } = weather
  const conditions = {
    'Clear': '☀️  right now',
    'Clouds': '☁️  right now',
    'Rain': '☔️  right now',
    'Mist': '🌫  right now',
    'Thunderstorm': '⛈  right now'
  }

  if (conditions[condition.type]) { acc.push(conditions[condition.type]) }
  if (!conditions[condition.type]) {
    acc.push(`unhandled condition: ${condition.type}`, condition)
    acc.push('🙏  open a PR on https://github.com/christian-fei/open-weather-map-cli')
  }

  return acc
}

function printReport (report) {
  report.forEach(row => process.stdout.write(`${row}\n`))
}
