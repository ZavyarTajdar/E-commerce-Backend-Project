import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Product } from "../models/product.models.js"
import { Category } from "../models/category.models.js"
import slugify from "slugify";

// createCategory, getCategories, updateCategory, deleteCategory, toggleIsFeatured
const createCategory = asyncHandler(async (req, res) => {
    const { name, description, parentCategory, isFeatured } = req.body;

    if (!name) {
        throw new ApiError(400, "Category name is required");
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
        throw new ApiError(400, "Category already exists");
    }

    if (parentCategory) {
        const parent = await Category.findById(parentCategory);
        if (!parent) {
            throw new ApiError(400, "Parent category does not exist");
        }
    }

    const category = await Category.create({
        name,
        slug,
        description,
        parentCategory: parentCategory || null,
        isFeatured: isFeatured || false
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            category,
            parentCategory ? "Subcategory created successfully" : "Parent category created successfully"
        )
    );
});



export {
    createCategory
}