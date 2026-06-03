const handler = require('../dist/apps/api/serverless.cjs');

module.exports = handler.default ?? handler;
