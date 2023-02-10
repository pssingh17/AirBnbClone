const jwt= require('jsonwebtoken')
const Model = require('../models/model')

const jwtVerifyHost = async (req, res, next) => {
  let token
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      token = authorization.split(' ')[1]

      // Verify Token
      const { userID } = jwt.verify(token, process.env.SECRET_KEY)

    //   console.log("userId", userID)
      req.user = await Model.findById(userID).select('-password')
      console.log(req.user)

      next()
    } catch (error) {
      console.log(error)
      res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
    }
  }
  if (!token) {
    res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
  }
}

module.exports = jwtVerifyHost;