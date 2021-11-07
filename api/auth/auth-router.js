const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const { jwtSecret } = require('../../secrets/index')
const Model = require('./Model')
const { checkPayload, checkUsername, checkUserExists } = require('../middleware/restricted')


function makeToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  }
  const options = {
    expiresIn: "1d"
  }
  return jwt.sign(payload, jwtSecret, options)
}


// router.get('/:id', (req, res) => {
//   const { id } = req.params
//   Model.findById(id)
//     .then(user => {
//       res.status(200).json(user)
//     })
//     .catch(err => {
//       res.status(500).json({ message: err.message })
//     })
// })

router.post('/register', checkPayload, checkUsername, (req, res) => {
  // res.end('implement register, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
  let user = req.body
  const hash = bcrypt.hashSync(req.body.password, 8)
  user.password = hash
  Model.register(user)
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(err => {
      res.status(500).json({ message: err.message })
    })
});

router.post('/login', checkPayload, checkUserExists, (req, res) => {
  // res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
  console.log(req.user)
  const { password, username } = req.body
  // const { correctPassword } = req.user.password
  if (bcrypt.compareSync(password, req.user.password)) {
    const token = makeToken(req.user)
    res.status(200).json({
      message: `welcome, ${username}`,
      token
    })
  }
  else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
});

module.exports = router;
