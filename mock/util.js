
const user = require('./user')
const device = require('./device')
const mocks = [
    ...user,
    ...device
]

  module.exports = {
    mocks
}