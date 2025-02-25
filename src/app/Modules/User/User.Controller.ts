import httpStatus from "http-status";
import { catchAsync } from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import UserService from "./User.Services";
const RegisterUser = catchAsync(async (req, res) => {
  const result = await UserService.RegisterUserInDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

export const UserControllers = {
  RegisterUser,
};
