const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('deployment workflow is configured for GitHub Pages', () => {
  const workflowPath = path.resolve(__dirname, '../.github/workflows/deploy.yml');
  assert.ok(fs.existsSync(workflowPath), 'deploy.yml should exist');

  const content = fs.readFileSync(workflowPath, 'utf8');
  assert.ok(content.includes('actions/upload-pages-artifact'), 'should upload pages artifact');
  assert.ok(content.includes('actions/deploy-pages'), 'should deploy pages');
  assert.ok(content.includes("path: './web'"), 'should upload ./web directory as artifact');
  assert.ok(content.includes('pages: write'), 'should grant pages write permission');
  assert.ok(content.includes('id-token: write'), 'should grant id-token write permission');
  assert.ok(content.includes('npm test'), 'should run tests before deploying');
});

test('static web deployment assets exist', () => {
  const webIndexPath = path.resolve(__dirname, '../web/index.html');
  assert.ok(fs.existsSync(webIndexPath), 'web/index.html entrypoint should exist');

  const content = fs.readFileSync(webIndexPath, 'utf8');
  assert.ok(content.includes('viewport'), 'web/index.html should contain viewport container');
  assert.ok(content.includes('three-scene.js'), 'web/index.html should reference three-scene.js');
  assert.ok(content.includes('main.js'), 'web/index.html should reference main.js');
});
