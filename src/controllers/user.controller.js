import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const generateAcessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(504, "Something went wrong while generating Acess And Refresh Token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, fullname, password, phoneNumber } = req.body

    if (!email || !username || !fullname || !password || !phoneNumber) {
        throw new ApiError(400, "All Field Are Rquired")
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const avatarlocalPath = req.file?.path

    const avatar = await uploadOnCloudinary(avatarlocalPath)

    if (!avatar) {
        throw new ApiError(404, "Failed to Upload File On Cloudinary");
    }

    const createdUser = await User.create({
        username : username.toLowerCase(),
        email,
        phoneNumber,
        password,
        fullname,
        avatar : avatar.url
    })

    const user = await User.findById(createdUser?._id)
    .select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "Something Went Wrong While Fetching User");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "User created successfully")
    )
})

export {
    registerUser
}