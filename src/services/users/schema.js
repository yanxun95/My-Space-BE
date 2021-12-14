import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: String },
    password: { type: String },
    userImage: { type: String },
    bgImage: { type: String },
    location: { type: String },
    education: { type: String },
    work: { type: String },
    googleId: { type: String },
    friends: [{ type: Schema.ObjectId, ref: "friend" }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const newUser = this;
  const plainPW = newUser.password;

  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(plainPW, 10);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const userDocument = this;
  const userObject = userDocument.toObject();
  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

userSchema.statics.checkCredentials = async function (email, plainPW) {
  // 1. find the user by email
  const user = await this.findOne({ email }); // "this" refers to UserModel

  if (user) {
    // 2. if the user is found we are going to compare plainPW with hashed one
    const isMatch = await bcrypt.compare(plainPW, user.password);
    // 3. Return a meaningful response
    if (isMatch) return user;
    else return null; // if the pw is not ok I'm returning null
  } else return null; // if the email is not ok I'm returning null as well
};

export default model("user", userSchema);
