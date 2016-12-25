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

var sh = require('shelljs')

module.exports = () => {
    sh.mkdir(['templates', 'files'])
    sh.cp(`${__dirname}/../defaults/run.yml`, 'run.yml')
    sh.cp(`${__dirname}/../defaults/inventory.yml`, 'inventory.yml')
    sh.cp(`${__dirname}/../defaults/var.yml`, 'var.yml')
    if (!sh.test('-e', `${process.env.HOME}/.automatejs`)) {
        sh.mkdir(`${process.env.HOME}/.automatejs`)
        sh.cp(`${__dirname}/../defaults/inventory.yml`, `${process.env.HOME}/.automatejs/inventory.yml`)
        sh.cp(`${__dirname}/../defaults/config.yml`, `${process.env.HOME}/.automatejs/config.yml`)
    }
}
