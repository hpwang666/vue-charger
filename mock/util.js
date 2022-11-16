
const user = require('./user')
const device = require('./device')
const depart = require('./depart')
const mocks = [
    ...user,
    ...device,
    ...depart
]

  module.exports = {
    mocks
}