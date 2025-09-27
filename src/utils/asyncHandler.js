const asyncHandler = (requestHandeler) => {
    return(req,res,next) => {
        Promise.resolve(requestHandeler(req,res,next))
        .catch((error) => {
            res
            .status(error.status || 404)
            .json({
                success: false,
                message: error.message || "SomeThing Went Wrong"
            });
        })
    }
}

export { asyncHandler }