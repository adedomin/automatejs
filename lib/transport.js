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

var ssh2 = require('ssh2'),
    fs = require('fs'),
    randomatic = require('randomatic'),
    waterfall = require('async.waterfall')

module.exports = (host, cb) => {
    var dirname = `.local/automatejs/${randomatic('*', 16)}`
    var conf = {
        host: host.host,
        port: host.port || 22,
        username: host.username || 'automatejs'
    }
    if (host.keyfile) conf.privateKey = fs.readFileSync(host.keyfile)
    // DON'T USE PASSWORDS
    else conf.password = host.password

    var conn = new ssh2.Client()
    conn.on('ready', () => {
        waterfall([(next) => {
            conn.sftp((err, sftp) => {
                if (err) return next(err)
                sftp.mkdir(dirname, (err) => {
                    if (err) return next(err)
                    
                    next(err, sftp.createWriteStream(dirname+'/.temp.tar.gz'))
                })
            })
        }, (writestream, next) => {
            var strm = fs.createReadStream('.temp.tar.gz').pipe(writestream)
            strm.on('error', (err) => {
                next(err)
            })
            strm.on('finish', () => {
                next()
            })
        }, (next) => {
            conn.shell((err, shellstrm) => {
                var stdout = '',
                    stderr = ''
                if (err) return next(err)
                shellstrm.on('close', () => {
                    if (stderr == '') stderr = null
                    next(stderr, stdout)
                })
                shellstrm.on('data', (data) => {
                    stdout += data
                })
                shellstrm.stderr.on('data', (data) => {
                    stderr += data
                })
                // note, you should be using passwordless sudo
                // make sure to disable password and only
                // allow login using a key
                shellstrm.end(`cd "${dirname}"
                tar xf ".temp.tar.gz"
                sudo node ".temp_build/index.js"
                exit >/dev/null 2>/dev/null
                `)
            }) 
        }], (err, res) => {
            if (!err) {
                try {
                    res = JSON.parse(res)
                }
                catch (e) {
                    err = e
                }
            }
            cb(err, res)
        })        
    }).connect(conf)
}
