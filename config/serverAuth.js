const
  jwt = require('jsonwebtoken'),
  jwtSecret = process.env.JWT_SECRET || 'NARLY'

const serverAuth = {
  //create a token that contains any data we want to put in it
  //use our jwtSecret to create the token
  //and include an expiration date in the payload:
  createToken: function(data) {
    return jwt.sign(data, jwtSecret, {expiresIn: '1 day'})
  },

  //verify the authenticity of the token using the jwtSecret:
  verifyToken: function(token) {
    return jwt.verify(token, jwtSecret)
  },

  //middleware that we can use before responding to a request.
  //this would protect any route using this middleware from being accessed
  //unless the request contains a valid token:
  authorize: function(req, res, next) {
    //look for the token in the request body, query params,
    //or a custom header called x-access-token
    const token = req.body.token || req.query.token || req.headers['x-access-token']
    //if no token, respond with status 403, unauthorized
    if(!token) return res.status(403).json({success: false, message: "Token is either invalid or not present."})

    //otherwise, try to verify and decode the token payload:
    const decoded = serverAuth.verifyToken(token)
    //if we can decode the token payload successfully,
    //add the decoded data to the request object,
    if(decoded) req.decoded = decoded

    // and move on to the originally requested route:
    next()
  }
}

module.exports = serverAuth
