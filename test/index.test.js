/* globals test */

const assert = require('assert')
const { toModel, toString, toBuffer, main, weatherFor, toReport } = require('..')

test('exports', () => {
  assert.ok(toModel)
  assert.ok(toString)
  assert.ok(toBuffer)
  assert.ok(main)
})

test('toModel', () => {
  const model = toModel({
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
  const rows = toReport({
    place: 'Trento',
    condition: {
      type: 'Clear',
      description: 'clear sky'
    }
  })

  assert.deepEqual(rows, [
    '🏡  Trento',
    '📖  Clear, clear sky',
    '☀️  right now'
  ])
})

test('toReport "Trento", Clouds', () => {
  const rows = toReport({
    place: 'Trento',
    condition: {
      type: 'Clouds',
      description: 'scattered clouds'
    }
  })

  assert.deepEqual(rows, [
    '🏡  Trento',
    '📖  Clouds, scattered clouds',
    '☁️  right now'
  ])
})

test('toReport "Moscow", Rain', () => {
  const rows = toReport({
    place: 'Moscow',
    condition: {
      type: 'Rain',
      description: 'light intensity shower rain'
    }
  })

  assert.deepEqual(rows, [
    '🏡  Moscow',
    '📖  Rain, light intensity shower rain',
    '☔️  right now'
  ])
})

test('placeholder', Function.prototype)
