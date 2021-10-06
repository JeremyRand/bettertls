#!/usr/bin/env node

/**
 *
 *  Copyright 2017 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */

const fs = require('fs');
const https = require('https');
const url = require('url');
const runner = require('./runner.js');

var rootCa = fs.readFileSync('../docs/root.crt');

function testUrl(targetUrl, andThen) {
  var options = url.parse(targetUrl);
  options.ca = rootCa;
  var req = https.request(options, function(res) {
    res.on('data', function(chunk) {
      // Ignored
    });
    res.on('end', function() {
      andThen(true);
    });
  })
  req.on('error', function(e) {
    andThen(false);
  });
  req.end();
}

var version = 'Node.js ' + JSON.stringify(process.versions);
console.log("UserAgent: " + version);
runner.runTests(version, function(dnsUrl, ipUrl, done) {
  testUrl(dnsUrl, function(dnsResult) {
    testUrl(ipUrl, function(ipResult) {
      done([dnsResult, ipResult]);
    });
  });
}, '../docs/results/node_6.9.4_linux.json');

