import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true, // SEO friendly URL (e.g. "mobile-phones")
      lowercase: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String, // category banner ya thumbnail
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // for sub-categories (self referencing)
      default: null,
    },
    isFeatured: {
      type: Boolean,
      default: false, // homepage par dikhana hai ya nahi
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", CategorySchema);
