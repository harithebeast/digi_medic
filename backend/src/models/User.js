const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Other'
    },
    age: {
      type: Number,
      min: 0
    },
    nationality: {
      type: String,
      trim: true
    },
    height: {
      type: Number,
      min: 0
    },
    weight: {
      type: Number,
      min: 0
    }
  }
}, { timestamps: true });

// Hash password before saving user
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
