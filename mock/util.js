
const user = require('./user')
const device = require('./device')
const org = require('./org')
const mocks = [
    ...user,
    ...device,
    ...org
]

  module.exports = {
    mocks
}