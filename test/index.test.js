/* globals test */

const assert = require('assert')
const execa = require('execa')
const { toWeather, toString, toBuffer, main, weatherFor, toReport } = require('..')

test('exports', () => {
  assert.ok(toWeather)
  assert.ok(toString)
  assert.ok(toBuffer)
  assert.ok(main)
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

test('uat', done => {
  execa('npm', ['start']).then(result => {
    const lines = result.stdout.split('\n')
    assert.equal(lines[4], '🏡  Trento')
    assert.ok(/^📖/.test(lines[5]))
    assert.ok(/right now$/.test(lines[6]))
    done()
  })
})

test('placeholder', Function.prototype)

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
