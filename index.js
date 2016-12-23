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

var yaml = require('js-yaml'),
    fs = require('fs'),
    build = require('./lib/build'),
    template = require('./lib/template'),
    transport = require('./lib/transport')

module.exports = (args, inventory) => {

    if (!args) args = yaml.safeLoads(
        fs.readFileSync('./var.yml')
    )
    
    var runbook = fs.createReadStream('./run.yml')
    var filestr = ''
    runbook.on('data', data => {
        filestr += data
    })

    runbook.on('end', () => {
        runbook = template(filestr, args) 
        build(runbook)

    })
    
}
