import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const Token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!Token) {
            throw new ApiError(401, "Access Denied, No Token Provided");
        }
        const decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
            .select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user; 
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        throw new ApiError(403, "Only admin can access this route");
    }
    next();
};