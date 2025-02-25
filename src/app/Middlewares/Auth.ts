import httpStatus from "http-status";
import CustomError from "../Errors/CustomError";
import { catchAsync } from "../Utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../Modules/User/User.Model";
import { IUser } from "../Modules/User/User.Interface";
const AuthGurd = (...roles: string[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers?.authorization;
    if (!token) {
      throw new CustomError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }
    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    const { email, role, NID } = decodedData;
    let user = await User.findOne({ email, NID });
    if (!user) {
      throw new CustomError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }
    req.user = decodedData;
    if (!roles.includes(role) || user.role !== role) {
      throw new CustomError(httpStatus.FORBIDDEN, "Forbidden");
    }
    // Checking if User is Blocked
    if (user.isBlocked) {
      throw new CustomError(httpStatus.FORBIDDEN, "User is blocked");
    }
    next();
  });
};
export default AuthGurd;
