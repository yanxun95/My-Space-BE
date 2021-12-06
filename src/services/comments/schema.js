import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    comment: { type: String, required: true },
    user: { type: Schema.ObjectId, ref: "user" },
    postId: { type: Schema.ObjectId, ref: "post" },
  },
  { timestamps: true }
);

commentSchema.methods.toJSON = function () {
  const commentDocument = this;
  const commentObject = commentDocument.toObject();
  delete commentObject.__v;
  delete commentObject.user.password;
  delete commentObject.user.friends;
  delete commentObject.user.createdAt;
  delete commentObject.user.updatedAt;
  delete commentObject.user.__v;

  return commentObject;
};

export default model("comment", commentSchema);
