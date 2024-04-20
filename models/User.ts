import mongoose, { Document } from "mongoose";
import toJSON from "./plugins/toJSON";
import { Platform } from "@/app/settings/LinkSettings";
import type { ProjectSettingsData } from "@/app/settings/ProjectSettings";

// USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    path: {
      type: String,
      trim: true,
      validate(value: string) {
        return /^[a-z0-9-]+$/i.test(value);
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      private: true,
    },
    image: {
      type: String,
    },
    customImage: {
      type: String,
    },
    role: {
      type: String,
    },
    location: {
      type: String,
    },
    bio: {
      type: String,
    },
    socialLinks: [
      {
        platform: {
          type: String,
          enum: ["twitter", "github", "linkedin", "dribbble", "behance"] as Platform[],
        },
        username: {
          type: String,
        },
      },
    ],
    projects: [
      {
        name: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        link: {
          type: String,
          trim: true,
        },
        stack: {
          type: [
            {
              name: {
                type: String,
                trim: true,
              },
              logo: {
                type: String,
                trim: true,
              },
              link: {
                type: String,
                trim: true,
              },
            },
          ],
        },
        logo: {
          type: String,
        },
      },
    ],
    // Used in the Stripe webhook to identify the user in Stripe and later create Customer Portal or prefill user credit card details
    customerId: {
      type: String,
      validate(value: string) {
        return value.includes("cus_");
      },
    },
    // Used in the Stripe webhook. should match a plan in config.js file.
    priceId: {
      type: String,
      validate(value: string) {
        return value.includes("price_");
      },
    },
    // Used to determine if the user has access to the product—it's turn on/off by the Stripe webhook
    hasAccess: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

export interface IUser extends Document {
  _id?: mongoose.Types.ObjectId;
  path: string;
  name: string;
  email: string;
  image?: string;
  customImage?: string;
  role?: string;
  location?: string;
  bio?: string;
  socialLinks?: {
    _id?: mongoose.Types.ObjectId;
    platform: Platform;
    username: string;
  }[];
  projects?: {
    _id?: mongoose.Types.ObjectId;
    id: string;
    name: string;
    description: string;
    link: string;
    stack: {
      _id?: mongoose.Types.ObjectId;
      name: string;
      logo: string;
      link: string;
    }[];
    logo?: string;
  }[],
  customerId?: string;
  priceId?: string;
  hasAccess?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default mongoose.models.User || mongoose.model<IUser>("User", userSchema);
