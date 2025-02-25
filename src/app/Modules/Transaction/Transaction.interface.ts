import mongoose from "mongoose";

export interface ITransaction {
  sender: mongoose.Types.ObjectId | string;
  receiver: mongoose.Types.ObjectId | string;
  transactionAmount: number;
  transactionType: string;
  description?: string;
  status: string;
}
