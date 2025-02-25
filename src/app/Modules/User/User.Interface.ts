import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  NID: number;
  balance?: number;
  pin: string;
  phone: string;
  isBlocked?: boolean;
  deviceCount?: number;
  role?: string;
  canAccess?: boolean;
}

export interface IResponseUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  NID: number;
  balance: number;
  pin: string;
  phone: string;
  deviceCount: number;
  password?: string;
  role?: string;
  __v: number;
}
