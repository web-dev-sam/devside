import mongoose, { Document } from "mongoose";
import toJSON from "./plugins/toJSON";
import { Platform } from "@/app/dashboard/LinkSettings";

// USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
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
          enum: ['twitter', 'github', 'linkedin', 'dribbble', 'behance'] as Platform[]
        },
        username: {
          type: String
        }
      }
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
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  image?: string;
  customImage?: string;
  role?: string;
  location?: string;
  bio?: string;
  socialLinks?: {
    platform: Platform;
    username: string;
  }[];
  customerId?: string;
  priceId?: string;
  hasAccess?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export default mongoose.models.User || mongoose.model<IUser>("User", userSchema);
