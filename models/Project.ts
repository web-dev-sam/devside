import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// PROJECT SCHEMA
const projectSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
    },
    name: {
      type: String,
    },
    link: {
      type: String,
    },
    description: {
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
projectSchema.plugin(toJSON);

export default mongoose.models.Project || mongoose.model("Project", projectSchema);
