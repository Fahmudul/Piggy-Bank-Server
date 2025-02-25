import httpStatus from "http-status";
import CustomError from "../../Errors/CustomError";
import { IResponseUser, IUser } from "../User/User.Interface";
import { User } from "../User/User.Model";
import bcrypt from "bcryptjs";
const LoginUserInDB = async (
  payload: Pick<IUser, "phone" | "pin" | "email">
) => {
  // Checking if user exists already
  const userExists = await User.findOne({
    $or: [{ email: payload.email }, { phone: payload.phone }],
  });
  if (!userExists) {
    throw new CustomError(httpStatus.FORBIDDEN, "You are not registered");
  }
  // Check if user is blocked
  if (userExists.isBlocked) {
    throw new CustomError(httpStatus.FORBIDDEN, "User is blocked");
  }
  // Is password correct
  const isPasswordCorrect = await bcrypt.compare(payload.pin, userExists.pin);
  if (!isPasswordCorrect) {
    throw new CustomError(httpStatus.FORBIDDEN, "Password is incorrect");
  }
  // Logged In Device Count
  if (userExists.deviceCount === 1) {
    throw new CustomError(
      httpStatus.FORBIDDEN,
      "You are logged in from another device"
    );
  }
  // Increase device count
  if (userExists.deviceCount === 0) userExists.deviceCount += 1;
  await userExists.save();
  console.log(userExists.toObject());
  const resultWithoutPassword = { ...userExists.toObject() } as IResponseUser;
  delete resultWithoutPassword.password;
  return resultWithoutPassword;
};
const LogOutUserInDB = async (email: string) => {
  console.log(email);
  const foundUser = await User.findOne({ email });
  console.log(foundUser);
  // Decrease device count
  if (foundUser?.deviceCount === 1) {
    foundUser.deviceCount -= 1;
    await foundUser.save();
  }
};
const AuthServices = {
  LoginUserInDB,
  LogOutUserInDB,
};
export default AuthServices;
