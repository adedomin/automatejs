// config for automatejs

var path = require('path').join

var config = {
    ssh: {
        default_user: 'automatejs',
        default_port: 22,
        default_keyfile: path(process.env.HOME, '.ssh', 'id_rsa')
    }
}

module.exports = config
