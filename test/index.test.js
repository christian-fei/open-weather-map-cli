/* globals test */

const assert = require('assert')
const execa = require('execa')
const { toWeather, toString, toBuffer, main, weatherFor, toReport } = require('..')

test('exports', () => {
  assert.ok(toWeather)
  assert.ok(toString)
  assert.ok(toBuffer)
  assert.ok(main)
  assert.ok(weatherFor)
  assert.ok(toReport)
})

test('toWeather', () => {
  const model = toWeather({
    name: 'Trento',
    weather: [{
      main: 'Clear',
      description: 'clear sky'
    }]
  })

  assert.ok(model)
  assert.deepEqual(model, {
    place: 'Trento',
    condition: {
      type: 'Clear',
      description: 'clear sky'
    }
  })
})

test('toReport "Trento", Clear', () => {
  const place = clearTrento()
  const rows = toReport(place)

  assert.deepEqual(rows, [
    '🏡  Trento',
    '📖  Clear, clear sky',
    '☀️  right now'
  ])
})

test('toReport "Trento", Clouds', () => {
  const place = cloudyTrento()
  const rows = toReport(place)

  assert.deepEqual(rows, [
    '🏡  Trento',
    '📖  Clouds, scattered clouds',
    '☁️  right now'
  ])
})

test('toReport "Moscow", Rain', () => {
  const place = rainyMoscow(9)
  const rows = toReport(place)

  assert.deepEqual(rows, [
    '🏡  Moscow',
    '📖  Rain, light intensity shower rain',
    '☔️  right now'
  ])
})

test('toReport "Moscow", Mist', () => {
  const place = mistyMoscow(9)
  const rows = toReport(place)

  assert.deepEqual(rows, [
    '🏡  Moscow',
    '📖  Mist, mist',
    '🌫  right now'
  ])
})

test('toReport "Moscow", Thunderstorm', () => {
  const place = thunderstormyMoscow(9)
  const rows = toReport(place)

  assert.deepEqual(rows, [
    '🏡  Moscow',
    '📖  Thunderstorm, thunderstorm with rain',
    '⛈  right now'
  ])
})

test('toReport unhandled condition, add PR', () => {
  const place = {
    place: 'Unknown',
    condition: {
      type: 'Unknown',
      description: 'unknown'
    }
  }
  const rows = toReport(place)

  assert.deepEqual(rows, [
    '🏡  Unknown',
    '📖  Unknown, unknown',
    'unhandled condition: Unknown',
    {'type': 'Unknown', 'description': 'unknown'},
    '🙏  open a PR on https://github.com/christian-fei/open-weather-map-cli'
  ])
})

test('weatherFor "Trento', done => {
  weatherFor('Trento')
  .then(weather => {
    assert.ok(weather)
    assert.ok(weather.place)
    assert.ok(weather.condition)
    assert.ok(weather.condition.type)
    assert.ok(weather.condition.description)
    done()
  })
})

test('uat `open-weather-map-cli Rome`', done => {
  execa('npm', ['start', 'Rome'])
  .then(result => {
    const stdoutlines = result.stdout.split('\n')
    const stderrlines = result.stderr.split('\n')

    assert.equal(stdoutlines[4], '🏡  Rome')
    assert.ok(/^📖/.test(stdoutlines[5]))
    assert.ok(/right now$/.test(stdoutlines[6]))
    assert.deepEqual(stderrlines, [''])
  })
  .then(done)
})

test('uat with invalid api key', done => {
  execa('npm', ['start', 'Rome'], {
    env: {
      OPEN_WEATHER_MAP_API_KEY: undefined
    }
  }).then(result => {
    const stderrlines = result.stderr.split('\n')
    assert.deepEqual(stderrlines, ['Please provide a valid api key for the https://openweathermap.org api'])
  })
  .then(done)
})

function clearTrento () {
  return {
    place: 'Trento',
    condition: {
      type: 'Clear',
      description: 'clear sky'
    }
  }
}

function cloudyTrento () {
  return {
    place: 'Trento',
    condition: {
      type: 'Clouds',
      description: 'scattered clouds'
    }
  }
}

function rainyMoscow () {
  return {
    place: 'Moscow',
    condition: {
      type: 'Rain',
      description: 'light intensity shower rain'
    }
  }
}

function mistyMoscow () {
  return {
    place: 'Moscow',
    condition: {
      type: 'Mist',
      description: 'mist'
    }
  }
}

function thunderstormyMoscow () {
  return {
    place: 'Moscow',
    condition: {
      type: 'Thunderstorm',
      description: 'thunderstorm with rain'
    }
  }
}
