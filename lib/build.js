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

var fs = require('fs'),
    os = require('os'),
    compose = require('jcomposer'),
    sh = require('shelljs'),
    browserify = require('browserify')

var buildJcomposable = (tree) => {
    return {
        name: tree.name,
        [tree.module]: tree.args
    }
}

var start = (tree) => {
    var path = `${os.tmpdir()}/automationjs/${tree.name}`
    sh.rm('-r', path)
    sh.mkdir(path)
    sh.cp('-R', 'files', path)
    sh.cp('-R', 'templates', path)
    browserify(compose(
        tree.task.map(buildJcomposable)),
        {
            detectGlobals: false,
            commondir: false,
            builtins: [],
            browserField: false,
            insertGlobals: false
        }
    ).bundle().pipe(fs.createWriteStream(path))
}

module.exports = start
