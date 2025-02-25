import httpStatus from "http-status";
import CustomError from "../../Errors/CustomError";
import { IResponseUser, IUser } from "./User.Interface";
import { User } from "./User.Model";
import bcrypt from "bcryptjs";
const RegisterUserInDB = async (payload: IUser) => {
  // console.log(payload)
  // Checking if user exists already
  const userExists = await User.findOne({
    email: payload.email,
    NID: payload.NID,
  });
  if (userExists) {
    throw new CustomError(httpStatus.FORBIDDEN, "User already exists");
  }
  // Hash Password
  payload.pin = await bcrypt.hash(payload.pin, 10);
  let result;
  switch (payload.role) {
    case "user": {
      result = await User.create(payload);
      break;
    }
    case "agent": {
      result = await User.create({
        ...payload,
        canAccess: false,
        balance: 100000,
      });
      break;
    }
  }
  const resultWithoutPassword = { ...result?.toObject() } as IResponseUser;
  delete resultWithoutPassword.password;
  // console.log(resultWithoutPassword);
  return resultWithoutPassword;
};
const UserService = {
  RegisterUserInDB,
};
export default UserService;
