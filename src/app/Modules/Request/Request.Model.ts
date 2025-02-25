import mongoose from "mongoose";
import { IRequest } from "./Request.interface";

const requestSchema = new mongoose.Schema<IRequest>(
  {
    requestSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    requestReceiver: {
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

const Request = mongoose.model("Request", requestSchema);
export default Request;
