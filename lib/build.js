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
    compose = require('jscomposer'),
    sh = require('shelljs'),
    browserify = require('browserify'),
    stream = require('stream')

var start = (tree, cb) => {
    var path = '.temp_build/'
    sh.rm('-r', path)
    sh.rm('.temp.tar.gz')
    sh.mkdir(path)
    sh.cp('-R', 'files', path)
    sh.cp('-R', 'templates', path)
    var s = new stream.Readable()
    s.push(compose(tree))
    s.push(null)
    var b = browserify(s, {
        detectGlobals: false,
        commondir: false,
        builtins: [],
        browserField: false,
        insertGlobals: false
    }).bundle().pipe(fs.createWriteStream(path+'index.js'))
    b.on('finish', () => {
        sh.exec(`tar -czf .temp.tar.gz ${path}`)
        if (cb) cb()
    })
}

module.exports = start
