import mongoose from "mongoose";

const { Schema, model } = mongoose;

const likeSchema = new Schema({
  userId: { type: Schema.ObjectId, ref: "profiles" },
  postId: { type: Schema.ObjectId, ref: "post" },
});

export default model("like", likeSchema);
