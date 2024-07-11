import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  });
  
  // Method to compare password
  UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

const User = mongoose.model('User', UserSchema);
export default User;
