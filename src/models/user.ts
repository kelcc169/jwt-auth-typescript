import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'You must enter a name'],
    minlength: [1, 'Name must be between 1 and 99 characters'],
    maxlength: [99, 'Name must be between 1 and 99 characters']
  },
  password: {
    type: String,
    required: [true, 'You must enter a password'],
    minlength: [8, 'Password must be between 8 and 128 characters'],
    maxlength: [128, 'Password must be between 8 and 128 characters']
  },
  email: {
    type: String,
    required: [true, 'You must enter an email'],
    minlength: [5, 'Email must be between 5 and 99 characters'],
    maxlength: [99, 'Email must be between 5 and 99 characters']
  }
});

userSchema.set('toObject', {
  transform: function(doc, ret, options) {
    let returnJson = {
      _id: ret._id,
      name: ret.name,
      email: ret.email
    }
    return returnJson
  }
})

userSchema.pre('save', function(next) {
  console.log(this.get('password'));
  if(!this.isModified('password')) {
      return next();
  }
  let plaintext = this.get('password');
  this.set('password', bcrypt.hashSync(plaintext, 12));
  next();
});

userSchema.methods.authenticated = function(password: string) {
  let plaintext = this.get('password');
  return bcrypt.compareSync(password, plaintext)
}

interface IAuthenticated {
  (password: string): boolean
}

interface IModelToObject {
  (): IUser
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  authenticated: IAuthenticated;
  toObject: IModelToObject;
}

export default mongoose.model('User', userSchema);