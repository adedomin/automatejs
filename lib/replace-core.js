/*
 * Copyright 2017 prussian <genunrest@gmail.com>
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

var core = {
    echo: 'automatejs-core/echo',
    file: 'automatejs-core/file',
    template: 'automatejs-core/template',
    shell: 'automatejs-core/shell'
}

var repl = (tree) => {
    if (!tree) return []
    return tree.map(module => {
        if (!module) return {}
        var modname = Object.keys(module)[1]
        var coremod = core[modname] || modname
        if (coremod == 'serial'
            || coremod == 'parallel') {

            return {
                name: module.name,
                [coremod]: repl(module[coremod])
            }
        }
        if (coremod == modname) return module
        return {
            name: module.name,
            [coremod]: module[modname]
        }
    })
}

module.exports = repl
