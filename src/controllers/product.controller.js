import { Product, Product } from "../models/product.models.js"
import { User } from "../models/user.models.js"
import { nanoid } from "nanoid"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { deleteOldImage } from "../utils/deleteOldImage.js"

const createProduct = asyncHandler(async (req, res) => {
    const { title, description, stock, price, variants, categoryId  } = req.body
    let { sku, barcode } = req.body

    if (!title || !description || !stock || !price) {
        throw new ApiError(400, "Everthing Is neccesary")
    }

    if (!req.files.pictures || req.files.pictures.length === 0) {
        throw new ApiError(400, "At least one picture is required")
    }

    const pictures = await Promise.all(
        req.files.pictures.map(file => uploadOnCloudinary(file.path))
    )

    const pictureUrls = pictures.map(pic => pic?.url).filter(Boolean);

    let video = null;
    if (req.files?.video?.[0]) {
        const uploadedVideo = await uploadOnCloudinary(req.files.video[0].path);
        video = uploadedVideo?.url || null;
    }

    if (!sku) {
        sku = `SKU-${nanoid(8)}`  // e.g. "SKU-ab12cd34"
    }
    if (!barcode) {
        barcode = `BAR-${nanoid(15)}` // e.g. "BAR-x9f0s1k2l3"
    }
    // nanoid generates unique Strings
    const existingProduct = await Product.findOne({ $or: [{ sku }, { barcode }] })
    if (existingProduct) {
        throw new ApiError(400, "Product already exists")
    }

    const product = await Product.create({
        title,
        description,
        stock,
        price,
        sku,
        barcode,
        pictures: pictureUrls,
        video,
        category: req.body.categoryId,
        variants: variants ? JSON.parse(variants) : [] // condition ? valueIfTrue : valueIfFalse
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201, product, "Product created successfully")
    )
})

const getAllProducts = asyncHandler(async (req, res) => {
    const { 
        page = 1, 
        limit = 10, 
        search = "", 
        category, 
        isFeatured, 
        minPrice, 
        maxPrice, 
        isAvailable 
    } = req.query;

    const query = {};

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    if (category) query.category = category;
    if (isFeatured) query.isFeatured = isFeatured === "true";
    if (isAvailable) query.isAvailable = isAvailable === "true";
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate("category", "name")
    .populate("seller", "name email");
    
    const total = await Product.countDocuments()
    const totalPages = Math.ceil(total / limit);
    return res.status(200).json({
        success: true,
        total,
        totalPages,
        page: Number(page),
        limit: Number(limit),
        products
    })

})

const getSingleProduct = asyncHandler(async (req, res) => {

    const { productId } = req.params

    if (!productId) {
        throw new ApiError(400, "product Id Is Required");
    }

    const product = await Product.findById(productId)
    .populate("category", "name")

    if (!product) {
        throw new ApiError(404, "Product Not Found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, product, "Product fetched successfully")
    )
})

const updateProduct = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "Product Id Is Necessary")
    }
    
    const product = await Product.findById(productId)

    if (!product) {
        throw new ApiError(404, "Product Does Not Found Or Not Exist")
    }

    const {
        title,
        description,
        stock,
        price,
        variants,
        categoryId,
        isAvailable,
        isFeatured
    } = req.body;

    let pictureUrl = product.pictures || [];
    if (req.files?.pictures?.length) {
        const uploadedPictures  = await Promise.all(
            req.files.pictures.map(files => uploadOnCloudinary(files.path))
        )
        pictureUrl = uploadedPictures .map(pic => pic?.url).filter(Boolean)
    }

    let videoUrl = product.video || null;
    if (req.files?.video?.[0]?.path) {
        const uploadedVideo = await uploadOnCloudinary(req.files.video[0].path);
        videoUrl = uploadedVideo?.url || null;
    }

    let parseVariants = product.variants || [];
    if (variants) {
        try {
            parseVariants = typeof variants === "string" ? JSON.parse(variants) : variants;
        } catch (error) {
            throw new ApiError(400, "Invalid JSON format for variants");
        }  
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            ...(title && { title }),
            ...(description && { description }),
            ...(stock && { stock }),
            ...(price && { price }),
            pictures: pictureUrl,
            video: videoUrl,
            variants: parseVariants,
            ...(categoryId && { category: categoryId }),
            ...(isAvailable !== undefined && { isAvailable }),
            ...(isFeatured !== undefined && { isFeatured })
        },
        { new: true }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedProduct,
            "Product Updated Successfully"
        )
    )
        
})

// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
    // TODO: find product by ID
    // TODO: delete product (or mark as unavailable for soft delete)
    // TODO: return success message
})

// Search products
const searchProducts = asyncHandler(async (req, res) => {
    // TODO: get search keyword from query
    // TODO: search in title + description fields
    // TODO: return matched products
})

// Filter products
const filterProducts = asyncHandler(async (req, res) => {
    // TODO: get filters (category, seller, price range, isFeatured, isAvailable)
    // TODO: query DB with filters
    // TODO: return filtered products
})

// Get featured products
const getFeaturedProducts = asyncHandler(async (req, res) => {
    // TODO: fetch products where isFeatured = true
    // TODO: return featured products
})

// Update stock after purchase
const updateProductStock = asyncHandler(async (req, res) => {
    // TODO: get productId and quantity from req.body
    // TODO: reduce stock based on purchased quantity
    // TODO: update ratings if needed
    // TODO: return updated stock info
})

// Rate a product
const rateProduct = asyncHandler(async (req, res) => {
    // TODO: get productId, rating from req.body
})

export {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterProducts,
    getFeaturedProducts,
    updateProductStock,
    rateProduct
}
