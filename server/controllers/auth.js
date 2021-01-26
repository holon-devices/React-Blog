const User = require('../models/user');
const { sendEmailWithNodemailer } = require("../helpers/email");
const jwt = require('jsonwebtoken');

exports.signup = (req, res) =>
{
    //console.log('Request body on signup', req.body);
    const {name, email, password} = req.body
    User.findOne({email}).exec((err, user) => {
        
        if(user){
            return res.status(400).json({
                error: 'Email is taken'
            })
        }

    })
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );
 
    const emailData = {
      from: "holondevices@gmail.com", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
      to: email, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE THE USER EMAIL (VALID EMAIL ADDRESS) WHO IS TRYING TO SIGNUP
      subject: "ACCOUNT ACTIVATION LINK",
      html: `
                <h1>Please use the following link to activate your account</h1>
                <p>http://localhost:4000/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>http://localhost:4000</p>
            `,
    };
 
    sendEmailWithNodemailer(req, res, emailData);




}

exports.accountActivation = (req, res) => {
    const {token} = req.body
    if(token){
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => { if(err){
            console.log('JWT verify in account activation error', err);
            return res.status(401).json({error: 'Expired link'})

        }
        const {name, email, password} = jwt.decode(token)
        let user = new User({name, email, password});
        user.save((err, success) => {
            if(err){
                console.log('Signup error', err)
                return res.status(401).json({
                error: 'Error saving user in db'
                });
            }
            res.json({
            message: 'Signup success! Please sign in'
            })
        })
    });
    } else {
        return res.json({
            message: 'Something went wrong on our end, please try again later'
        })
    }
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
    // check if user exist
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup'
            });
        }
        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password do not match'
            });
        }
        // generate a token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { _id, name, email, role } = user;

        return res.json({
            token,
            user: { _id, name, email, role }
        });
    });
};
