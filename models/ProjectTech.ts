import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// PROJECT TECH SCHEMA
const projectTechSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
projectTechSchema.plugin(toJSON);

export default mongoose.models.Project || mongoose.model("ProjectTech", projectTechSchema);
