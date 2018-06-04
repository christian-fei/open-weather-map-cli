/* globals test */

const assert = require('assert')
const { toModel, toString, toBuffer, main, weatherFor } = require('..')

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

test('placeholder', Function.prototype)
