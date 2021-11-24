const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

//name, email, photo, password, password confirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Provide a Name']
  },
  email: {
    type: String,
    required: [true, 'Please Provide Your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'PLease Provide a valid Email']
  },
  photo: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    minLength: 8,
    required: [true, 'Please Provide Your password'],
    select: false
  },
  passwordConfirm: {
    type: String,
    minLength0: 8,
    required: [true, 'Please Provide Your password'],
    validate: {
      // This Only Works For Save
      validator: function(el) {
        return el === this.password;
      },
      message: 'Password Must be Same'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

userSchema.pre('save', async function(next) {
  //only runs this fuunction is password was modified
  if (!this.isModified('password')) return next();

  //Hash Password with cost 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete Password Confirm Field
  this.passwordConfirm = undefined;
});

// INSTANCE METHOD - define on each instance of a class
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//changed Password Instance Method
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(`UserSchema Method Changed Password`);
    return JWTTimestamp < changedTimeStamp;
  }
  //False Mean Password Doesn't Changed
  return false;
};

//Another Instance Method For Forget Password Functionality
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  //hashing resetToken
  //this refer to instace of model
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
