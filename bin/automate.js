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
    fs = require('fs'),
    yaml = require('js-yaml')

if (process.argv[2] == 'init') return init()
else if (process.argv[2] == 'build') {

    var inline_var = process.argv.slice(3).indexOf('-V')
    if (inline_var < 0) inline_var = process.argv.slice(3).indexOf('--variables')
    if (inline_var > -1) {
        return index(JSON.parse(process.argv[inline_var+3]))
    }

    var input_vars = ''
    if (!process.stdin.isTTY) {
        process.stdin.on('data', data => {
            input_vars += data    
        })
        process.stdin.on('end', () => {
            index(JSON.parse(input_vars))
        })
    }
    else {
        var vars = fs.createReadStream('var.yml')
        vars.on('data', data => {
            input_vars += data
        })
        vars.on('end', () => {
            index(yaml.safeLoad(input_vars))
        })
    }
}
