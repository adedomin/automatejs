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
    transport = require('./lib/transport'),
    each = require('async.each'),
    path = require('path').join,
    config 

try {
    config = require(path(process.env.HOME, '.automatejs', 'config.js'))
}
catch (e) {
    config = {}
}

module.exports = (args, inventory) => {

    if (!args) args = yaml.safeLoad(
        fs.readFileSync('./var.yml')
    )

    if (!inventory) {
        try {
            inventory = yaml.safeLoad(
                fs.readFileSync('./inventory.yml')
            )
        }
        catch (e) {
            inventory = yaml.safeLoad(
                fs.readFileSync(
                    config.inventory.default_inventory_file
                )
            )
        }
    }
    
    var runbook = fs.createReadStream('./run.yml')
    var filestr = ''
    runbook.on('data', data => {
        filestr += data
    })

    runbook.on('end', () => {
        runbook = yaml.safeLoad(template(filestr, args)) 
        build(runbook)
        each(inventory[runbook.hosts], (host, cb) => {
            if (!host.keyfile) host.keyfile = config.ssh.default_keyfile
            transport(host, (err, res) => {
                console.log(`# ${host.host}:`)
                console.log(`error: ${err}`)
                console.log(`results: ${res}`)
                cb(err)
            })
        }, (err) => {
            if (err) throw err
        })
    }) 
}
