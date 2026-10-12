const assert = require('node:assert/strict');
const test = require('node:test');

const QGearEngine = require('../engine/system');

test('engine updates only while running', () => {
  const engine = new QGearEngine();

  engine.update();
  assert.equal(engine.frameCount, 0);

  engine.start();
  engine.update();
  assert.equal(engine.frameCount, 1);

  engine.stop();
  engine.update();
  assert.equal(engine.frameCount, 1);
});
