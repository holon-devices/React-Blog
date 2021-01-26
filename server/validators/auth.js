const {check} = require('express-validator');

exports.userSignupValidator = [
    check('name').not().isEmpty().withMessage('name is required'),
    check('email').isEmail().withMessage('Must be a valid email'),
    check('password').isLength({min: 6}).withMessage('Passwords must be at least 8 characters long')
]

exports.userSigninValidator = [
    check('email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least  6 characters long')
];