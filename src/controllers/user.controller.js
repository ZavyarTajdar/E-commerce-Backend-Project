import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { deleteOldImage } from "../utils/deleteOldImage.js"
import jwt from "jsonwebtoken"

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
        username: username.toLowerCase(),
        email,
        phoneNumber,
        password,
        fullname,
        avatar: avatar.url
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

const loginUser = asyncHandler(async (req, res) => {

    // Step 1
    const { email, username, password } = req.body

    if (!username && !email) {
        throw new ApiError(404, "Give Atleast One Email or Username");
    }

    const user = await User.findOne({ $or: [{ email }, { username }] }).select("+password")

    if (!user) {
        throw new ApiError(404, "User Does Not Exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(404, "Password is required");
    }

    const { accessToken, refreshToken } = await generateAcessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"),
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(201)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new ApiResponse(201, {}, "User Logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incommingRefreshToken) {
        throw new ApiError(401, "Unauthorized request - No refresh token");
    }

    try {
        const decode = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decode?._id)

        if (!user) {
            throw new ApiError(401, "Unauthorized request - No user");
        }

        if (incommingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Unauthorized request - Token mismatch");
        }

        const { accessToken, refreshToken } = await generateAcessAndRefreshToken(user._id)
        const option = {
            httpOnly: true,
            secure: true
        }
        
        return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(200, { accessToken, refreshToken },
            "Access token Regenerated successfully")
        )
    } catch (error) {
         throw new ApiError(401, error?.message || "Something Went Wrong While Refreshing Access Token");
    }
})

const ChangeCurrentUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
        throw new ApiError(400, "All fields (oldPassword, newPassword, confirmPassword) are required");
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "New password and confirm password do not match");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Old password is incorrect");
    }

    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password cannot be the same as old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email, username, phoneNumber } = req.body;

    if (!(fullname || email || username || phoneNumber)) {
        throw new ApiError(400, "Fullname, email, username and phone number are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { fullname, email, username, phoneNumber } },
        { new: true }
    ).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar File is Missing");
    }

    const Avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!Avatar) {
        throw new ApiError(400, "Avatar Uploading Failed");
    }

    const existingUser = await User.findById(req.user._id);

    if (existingUser?.avatar) {
        await deleteOldImage(existingUser.avatar);
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: Avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar Updated Successfully"))
})

const deleteUserAccount = asyncHandler(async (req, res) => {
    await User.findByIdAndDelete(req.user._id)
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User Deleted Successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    ChangeCurrentUserPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    deleteUserAccount,
}