import AppError from "../utils/AppError.js";

export const allowRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole) {
            return next(new AppError("User role not found", 403));
        }
        if (!allowedRoles.includes(req.userRole)) {
            return next(new AppError("Forbidden: You do not have access to this resource", 403));
        }
        next();
    }
}