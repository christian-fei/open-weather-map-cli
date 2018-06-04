/* globals test */

const assert = require('assert')
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
