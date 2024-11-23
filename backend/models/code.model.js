import mongoose from "mongoose";

const codeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Code = mongoose.model("Code", codeSchema);

export default Code;
