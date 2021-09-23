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
  }
});

userSchema.pre('save', async function(next) {
  //only runs this fuunction is password was modified
  // if (this.isModified('password')) return next();

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

const User = mongoose.model('User', userSchema);
module.exports = User;
