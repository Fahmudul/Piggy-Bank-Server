import mongoose from "mongoose";
import { ITransaction } from "./Transaction.interface";

const transactionSchema = new mongoose.Schema<ITransaction>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    transactionAmount: {
      type: Number,
    },
    transactionType: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Success"],
      required: true,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
