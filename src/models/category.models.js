import mongoose from "mongoose";
import slugify from "slugify";
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
    thumbnail: {
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
    isActive: {
      type: Boolean,
      default: true, // soft delete ke liye
    },
  },
  { timestamps: true }
);

CategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
}); 

export const Category = mongoose.model("Category", CategorySchema);
