import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

// schema model
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    trim: true,
    minlength: 3,
    validate: validator.isEmail,
  },
  photoURL: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// middelwares
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//compare password
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

const User = mongoose.model("User", userSchema);

export default User;
