import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    img: { type: String },
    user: { type: Schema.ObjectId, ref: "user" },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

postSchema.methods.toJSON = function () {
  const postDocument = this;
  const postObject = postDocument.toObject();
  delete postObject.__v;
  delete postObject.user.password;
  delete postObject.user.__v;
  delete postObject.user.createdAt;
  delete postObject.user.updatedAt;
  delete postObject.user.friends;
  delete postObject.user.bgImage;
  delete postObject.user.work;
  delete postObject.user.location;
  delete postObject.user.education;
  delete postObject.user.dob;
  delete postObject.user.email;

  return postObject;
};

export default model("post", postSchema);
