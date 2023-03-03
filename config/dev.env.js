'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = {
  NODE_ENV: '"development"',
  ENV_CONFIG:'"dev"',
  BASE_URL:'"http://127.0.0.1:8080"',
}
