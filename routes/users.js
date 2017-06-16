const
  express = require('express'),
  usersRouter = new express.Router(),
  usersCtrl = require('../controllers/users.js'),
  User = require('../models/User.js'),
  serverAuth = require('../config/serverAuth.js')

usersRouter.post('/login', (req, res) => {
  //when a user attempts to log in, try and find the user by the provided email:
  User.findOne({email: req.body.email}, '+password', (err, user) => {

    //if there is no user, or password is wrong, respond accordingly
    if(!user || !user.validPassword(req.body.password)){
      return res.status(403).json({message: "invalid credentials"})
    }

    //if there is a user and the password is correct,
    //generate token, that includes user in the payload (without the password):
    if(user && user.validPassword(req.body.password)) {
      const userData = user.toObject()
      delete userData.password

      const token = serverAuth.createToken(userData)
      res.json({token: token})
    }
  })
})

usersRouter.route('/')
  .get(usersCtrl.index)
  .post(usersCtrl.create)

//token ust be provided to access
//the routes declared after this middleware:
usersRouter.use(serverAuth.authorize)

usersRouter.route('/:id')
  .get(usersCtrl.show)
  .patch(usersCtrl.update)
  .delete(usersCtrl.destroy)

module.exports = usersRouter
