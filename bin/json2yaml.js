#!/usr/bin/env node

// modules and helpers
var exists = require('path').existsSync,
    realpath = require('fs').realpathSync,
    read = require('fs').readFileSync,
    inspect = require('util').inspect,
    jsyaml = require(__dirname + '/../lib/js-yaml');


try {
  if (!process.argv[2]) {
    console.error("Please specify JSON file you want to convert");
    process.exit(1);
  }

  var file = realpath(process.argv[2]);
  if (!exists(file)) {
    console.error("Specified file '" + process.argv[2] + "' not found");
    process.exit(1);
  }

  var json = require(file);
  console.log(jsyaml.dump(json));
  process.exit(0);
} catch (err) {
  console.error(err.stack || err.message || err.toString());
  process.exit(1);
}
