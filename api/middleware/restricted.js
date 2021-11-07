const Model = require('../auth/Model.js')
const { jwtSecret } = require('../../secrets/index')
const jwt = require("jsonwebtoken")
// module.exports = (req, res, next) => {
//   next();
/*
  IMPLEMENT

  1- On valid token in the Authorization header, call next.

  2- On missing token in the Authorization header,
    the response body should include a string exactly as follows: "token required".

  3- On invalid or expired token in the Authorization header,
    the response body should include a string exactly as follows: "token invalid".
*/
// };

const restrict = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    res.status(401).json({ message: 'token required' })
  }
  else {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'token invalid' })
      }
      else {
        req.decodedToken = decoded
        next()
      }
    })
  }
  // else if(token !== req.body.token){
  //   res.status(403).json({message:'token invalid'})
  // }

  // else{
  //   next()
  // }

}
const checkPayload = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(500).json({ message: 'Username and password required' })
  }
  else {
    next()
  }
}

const checkUsername = (req, res, next) => {
  Model.find(req.body.username)
    .then(response => {
      if (response.length) {
        res.status(422).json({ message: 'Username taken' })
      }
      else {
        req.user = response[0]
        next()
      }
    })
    .catch(err => {
      res.status(500).json({ message: err.message })
    })
}

const checkUserExists = (req, res, next) => {
  Model.find(req.body.username)
    .then(response => {
      if (response.length) {
        req.user = response[0]
        next()
      }
      else {
        res.status(500).json({ message: 'Invalid Credentials' })
      }
    })

}


module.exports = {
  restrict,
  checkPayload,
  checkUsername,
  checkUserExists
}
