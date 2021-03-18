const { body } = require('express-validator');

module.exports = [
    body('email').isEmail().normalizeEmail(),
    body('nome').notEmpty({ ignore_whitespace: true }).trim(),
    body('senha').isLength({ min: 5 })
]