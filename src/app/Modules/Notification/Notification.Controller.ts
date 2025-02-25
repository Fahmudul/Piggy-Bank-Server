import httpStatus from "http-status";
import { catchAsync } from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import jwt from "jsonwebtoken";
import AuthServices from "./Notification.Services";
const LoginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.LoginUserInDB(req.body);
  // Generate Token
  const tokenData = {
    email: result.email,
    role: result.role,
    NID: result.NID,
    id: result._id,
    phone: result.phone,
  };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET as string);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 1209600,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully",
    data: token,
  });
});

const LogOutUser = catchAsync(async (req, res) => {
  const result = await AuthServices.LogOutUserInDB(req.body.email);
  res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

export const AuthControllers = {
  LoginUser,
  LogOutUser,
};
