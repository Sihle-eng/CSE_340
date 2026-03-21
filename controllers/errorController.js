const utilities = require('../utilities')
const errorController = {}

// Controller to intentionally throw a 500 error
errorController.triggerError = async function (req, res, next) {
    try {
        // Intentionally throw an error
        throw new Error('Intentional 500 error for testing purposes.')
    } catch (error) {
        next(error)
    }
}

module.exports = errorController
