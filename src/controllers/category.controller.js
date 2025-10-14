import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Category } from "../models/category.models.js"
import slugify from "slugify";

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
    const Paththumbnail = req.file ? req.file.path : null;
    if (!Paththumbnail) {
        throw new ApiError(400, "Category thumbnail is required");
    }

    const thumbnail = await uploadOnCloudinary(Paththumbnail)

    if (!thumbnail) {
        throw new ApiError(400, "Category thumbnail upload failed");
    }

    const category = await Category.create({
        thumbnail: thumbnail.url,
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

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().populate('parentCategory', 'name slug');
    return res
        .status(200)
        .json(
            new ApiResponse(200, categories, "Categories Fetched Successfully")
        )
})

const updateCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params
    const { name, description, parentCategory } = req.body;

    if (!categoryId) {
        throw new ApiError(400, "Category ID Is Required");
    }

    if (parentCategory && parentCategory === categoryId) {
        throw new ApiError(400, "A category cannot be its own parent");
    }

    if (!name) {
        throw new ApiError(400, "Category name is required");
    }

    const slug = slugify(name, { lower: true, strict: true })

    if (parentCategory) {
        const parent = await Category.findById(parentCategory)
        if (!parent) {
            throw new ApiError(400, "Parent Category Does Not Exist")
        }
    }

    const category = await Category.findByIdAndUpdate(
        categoryId,
        {
            name,
            description,
            slug,
            parentCategory: parentCategory || null
        },
        {
            new: true,
            runValidators: true
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                category,
                parentCategory ? "Subcategory updated successfully" : "Parent category updated successfully"
            )
        )
})

const updateCategoryThumbnail = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    if (!categoryId) {
        throw new ApiError(400, "Category ID is required");
    }

    const Paththumbnail = req.file ? req.file.path : null;

    if (!Paththumbnail) {
        throw new ApiError(400, "Category thumbnail is required");
    }

    const thumbnail = await uploadOnCloudinary(Paththumbnail);

    if (!thumbnail) {
        throw new ApiError(400, "Category thumbnail upload failed");
    }

    const category = await Category.findByIdAndUpdate(
        categoryId,
        {
            thumbnail: thumbnail.url
        },
        {
            new: true,
            runValidators: true
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                category,
                "Category thumbnail updated successfully"
            )
        );
});

const toggleIsFeatured = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    if (!categoryId) {
        throw new ApiError(400, "Category ID is required");
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    if (category.isFeatured) {
        category.isFeatured = false;
    } else {
        category.isFeatured = true;
    }

    await category.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            category,
            category.isFeatured ? "Category marked as featured" : "Category unmarked as featured"
        )
    );
})

const getCategoryById = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    if (!categoryId) {
        throw new ApiError(400, "Category ID is required");
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            category,
            "Category fetched successfully"
        )
    );
})

const SoftdeleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    if (!categoryId) {
        throw new ApiError(400, "Category ID is required");
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    category.isActive = false;
    await category.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            category,
            "Category soft deleted successfully"
        )
    );
})

export {
    createCategory,
    getCategories,
    updateCategory,
    toggleIsFeatured,
    getCategoryById,
    SoftdeleteCategory,
    updateCategoryThumbnail
}