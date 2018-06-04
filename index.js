const { get } = require('https')
// const {promisify} = require('util')

if (require.main === module) {
  main('Trento', process.env.npm_config_open_weather_map_api_key)
} else {
  module.exports = {
    main,
    weatherFor,
    toBuffer,
    toString,
    toModel
  }
}

function main (place, apiKey = process.env.npm_config_open_weather_map_api_key) {
  weatherFor(place, apiKey)
  .then(weather => {
    const { condition } = weather

    console.log(`🏡  ${weather.place}\n📖  ${condition.type}, ${condition.description}`)
    const conditions = {
      'Clear': '☀️  right now',
      'Clouds': '☁️  right now'
    }
    if (conditions[condition.type]) { console.log(conditions[condition.type]) }
    if (!conditions[condition.type]) { console.error(`unhandled condition: ${condition.type}`, condition) }
    // http://openweathermap.org/img/w/01d.png
  })
}

function weatherFor (place, apiKey = process.env.npm_config_open_weather_map_api_key) {
  return new Promise((resolve, reject) => {
    get(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apiKey}`, res => {
      toString(res, (err, string) => {
        if (err) return reject(err)
        if (!string) return reject(string)
        const json = JSON.parse(string)
        // console.log('json', json)
        if (!json) return reject(json)
        const weather = toModel(json)
        resolve(weather)
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

function toModel (json) {
  const toCondition = json => ({
    type: json.weather[0].main,
    description: json.weather[0].description
  })

  return {
    place: json.name,
    condition: toCondition(json)
  }
}
