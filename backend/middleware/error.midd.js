const errorMiddleware = (error, req, res, next) => {
    return res.status(error.statusCode || 500).json(
        {
            success: false,
            message: error.message || 'Somthing Went Wrong',
            stack: error.stack
        }
    )
}

export default errorMiddleware;