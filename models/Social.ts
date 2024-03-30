import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// SOCIAL SCHEMA
const socialSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    link: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
socialSchema.plugin(toJSON);

export default mongoose.models.Social || mongoose.model("Social", socialSchema);
