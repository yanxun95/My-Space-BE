import mongoose from "mongoose";

const { Schema, model } = mongoose;

const likeSchema = new Schema({
  userId: { type: Schema.ObjectId, ref: "profiles" },
  postId: { type: Schema.ObjectId, ref: "post" },
});

likeSchema.methods.toJSON = function () {
  const likeDocument = this;
  const likeObject = likeDocument.toObject();
  delete likeObject.__v;

  return likeObject;
};

export default model("like", likeSchema);
