import mongoose from "mongoose";

const { Schema, model } = mongoose;

const customiseSchema = new Schema({
  userId: { type: Schema.ObjectId, ref: "user" },
  userInfo: { type: String },
  userBgImage: { type: String },
  postUserInfo: { type: String },
  postUserContent: { type: String },
  postUserImage: { type: String },
  postUserFunctionBar: { type: String },
});

customiseSchema.methods.toJSON = function () {
  const customiseDocument = this;
  const customiseObject = customiseDocument.toObject();
  delete customiseObject.__v;

  return customiseObject;
};

export default model("customise", customiseSchema);
