const
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  userSchema = new mongoose.Schema({
    name: String,
    email: String,

    //when 'select' is set to false, this field
    //will not show up in queries by default
    password: {type: String, select: false}
  })

  // this function will take a string and encrypt it with bcrypt:
userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

//this function can take a given password and compare it to the encrypted version.
// returns boolean: does the given password match? true / false:
userSchema.methods.validPassword = function(password){
  if(!password) return false
  return bcrypt.compareSync(password, this.password)
}

userSchema.pre('save', function(next){
  const user = this
  if(!user.isModified('password')) return next()
  user.password = user.generateHash(user.password)
  next()
})

module.exports = mongoose.model('User', userSchema)
