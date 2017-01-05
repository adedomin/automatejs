#!/usr/bin/env node
/*
 * Copyright 2016 prussian <genunrest@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var init = require('../lib/init'),
    index = require('../index'),
    getarg = require('../lib/getarg.js'),
    fs = require('fs'),
    yaml = require('js-yaml'),
    deploy = true

if (process.argv[2] == 'init') return init()
if (process.argv[2] == 'build') deploy = false

var args, inventory
var arg_v = getarg('-V', '--variables')
if (arg_v) args = JSON.parse(arg_v)
var inv_v = getarg('-i', '--inventory')
if (inv_v) inventory = yaml.safeLoad(
    fs.readFileSync(inv_v)
)

var input_vars = ''
if (!process.stdin.isTTY && !args) {
    process.stdin.on('data', data => {
        input_vars += data    
    })
    process.stdin.on('end', () => {
        index(JSON.parse(input_vars), inventory, deploy)
    })
    return
}

var vars = fs.createReadStream('var.yml')
vars.on('data', data => {
    input_vars += data
})
vars.on('end', () => {
    var newargs = Object.assign({}, yaml.safeLoad(input_vars), args)
    index(newargs, inventory, deploy)
})
vars.on('error', () => {
    index(args, inventory, deploy)
})
