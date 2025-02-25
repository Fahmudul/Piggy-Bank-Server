import httpStatus from "http-status";
import CustomError from "../../Errors/CustomError";
import { User } from "../User/User.Model";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import Transaction from "./Transaction.Model";
import Notification from "../Notification/Notification.Model";
import Request from "../Request/Request.Model";
const SendMoney = async (
  payload: Record<string, any>,
  senderInfo: JwtPayload
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Checking if user exists already
    const receiverExists = await User.findOne({ phone: payload.receiever });
    if (!receiverExists) {
      throw new CustomError(httpStatus.FORBIDDEN, "Receiver not found!");
    }
    // Check if user is blocked
    if (receiverExists.isBlocked) {
      throw new CustomError(httpStatus.FORBIDDEN, "Receiver is blocked");
    }

    // Updating Sender Balance
    const sender = await User.findOne({ phone: senderInfo.phone });
    // Chekcing enouogh balance
    if (sender?.balance && sender.balance < payload.amount) {
      throw new CustomError(httpStatus.FORBIDDEN, "Not enough balance");
    }
    // Deducting sender and adding reciever balance
    if (sender?.balance) {
      await User.findByIdAndUpdate(
        sender._id,
        {
          $inc: { balance: -payload.amount },
        },
        { session: session, new: true }
      );
      await User.findByIdAndUpdate(
        receiverExists._id,
        {
          $inc: { balance: payload.amount },
        },
        { session: session, new: true }
      );
      console.log("passed 4");
    }
    const transactionData = {
      transactionAmount: payload.amount,
      receiver: receiverExists._id,
      sender: senderInfo.id,
      transactionType: payload.transactionType,
      status: payload.transactionType === "Send Money" ? "Success" : "Pending",
    };
    // Create transaction history for both sender and reciever
    const senderTransaction = await Transaction.create([transactionData], {
      session: session,
    });
    // Create a notification for reciever
    const notificationData = {
      sender: senderInfo.id,
      owner: receiverExists._id,
      amount: payload.amount,
      notificationType: payload.transactionType,
    };

    await Notification.create([notificationData], {
      session: session,
    });
    await session.commitTransaction();
    return senderTransaction;
  } catch (error) {
    await session.abortTransaction();
    console.log("transaction failed", error);
    throw new CustomError(httpStatus.FORBIDDEN, "Transaction failed");
  } finally {
    await session.endSession();
  }
};
const CashRequest = async (
  payload: Record<string, any>,
  senderInfo: JwtPayload
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Checking if agent exists
    const agentExists = await User.findOne({ phone: payload.receiever });
    if (!agentExists) {
      throw new CustomError(httpStatus.FORBIDDEN, "Agent not found!");
    }
    // Check if agent is blocked
    if (agentExists.isBlocked) {
      throw new CustomError(httpStatus.FORBIDDEN, "Agent is blocked");
    }
    // Sender Info from DB
    const sender = await User.findOne({ phone: senderInfo.phone });
    // Create a cash request to agent
    const requestData = {
      transactionAmount: senderInfo.role === "agent" ? 100000 : payload.amount,
      requestSender: sender?._id,
      requestReceiver: agentExists._id,
      transactionType: payload.transactionType,
      status: "Pending",
      description: `${senderInfo.phone} wants ${payload.transactionType} request of ${payload.amount}$`,
    };
    await Request.create([requestData], {
      session: session,
    });
    // Create a notification for agent
    const notificationData = {
      sender: sender?._id,
      owner: agentExists._id,
      amount: senderInfo.role === "agent" ? 100000 : payload.amount,
      notificationType: payload.transactionType,
    };

    await Notification.create([notificationData], {
      session: session,
    });
    await session.commitTransaction();
    return true;
  } catch (error) {
    await session.abortTransaction();
    console.log("transaction failed", error);
    throw new CustomError(httpStatus.FORBIDDEN, "Transaction failed");
  } finally {
    await session.endSession();
  }
};
const CashOutRequestAction = async (
  payload: Record<string, any>,
  receiverInfo: JwtPayload,
  agentRequest?: boolean
) => {
  const requestExists = await Request.findOne({
    requestSender: payload.id,
    requestReceiver: receiverInfo.id,
  });
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    switch (payload.action) {
      case "Accept": {
        // Get Agent information
        const agent = await User.findOne({
          _id: requestExists?.requestReceiver,
        });
        if (agentRequest) {
          await User.findByIdAndUpdate(
            requestExists?.requestSender,
            {
              $inc: { balance: 100000 },
            },
            { session: session, new: true }
          );
        }
        // Check if agent has enough balance
        else if (
          agent?.balance &&
          agent.balance < requestExists?.transactionAmount!
        ) {
          throw new CustomError(httpStatus.FORBIDDEN, "Not enough balance");
        } else {
          // Deducting agent and adding reciever balance
          await User.findByIdAndUpdate(
            agent?._id,
            {
              $inc: { balance: requestExists?.transactionAmount! },
            },
            { session: session, new: true }
          );
          await User.findByIdAndUpdate(
            requestExists?.requestSender,
            {
              $inc: { balance: -requestExists?.transactionAmount! },
            },
            { session: session, new: true }
          );
        }
        // Delete request
        await Request.findByIdAndDelete(requestExists?._id);
        // Create a transaction history for both sender and reciever
        const transactionData = {
          transactionAmount: requestExists?.transactionAmount!,
          receiver: requestExists?.requestSender,
          sender: requestExists?.requestReceiver,
          transactionType: "Cash Out",
          status: "Success",
        };
        await Transaction.create([transactionData], { session });
        // Create notification for reciever
        const notificationData = {
          sender: requestExists?.requestSender,
          owner: requestExists?.requestReceiver,
          amount: requestExists?.transactionAmount!,
          notificationType: "Cash Out",
        };
        await Notification.create([notificationData], { session });
        break;
      }
      case "Decline": {
        await Request.findByIdAndDelete(requestExists?._id);
        break;
      }
    }
    await session.commitTransaction();
    return true;
  } catch (error) {
    await session.abortTransaction();
    console.log("transaction failed", error);
    throw new CustomError(httpStatus.FORBIDDEN, "Transaction failed");
  } finally {
    await session.endSession();
  }
};
const CashInRequestAction = async (
  payload: Record<string, any>,
  receiverInfo: JwtPayload
) => {
  const requestExists = await Request.findOne({
    requestSender: payload.id,
    requestReceiver: receiverInfo.id,
  });
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    switch (payload.action) {
      case "Accept": {
        // Check if request is valid
        // Get Agent information
        const agent = await User.findOne({ _id: receiverInfo.id });
        // Check if agent has enough balance
        if (
          agent?.balance &&
          agent.balance < requestExists?.transactionAmount!
        ) {
          throw new CustomError(httpStatus.FORBIDDEN, "Not enough balance");
        }
        // Deducting agent and adding reciever balance
        await User.findByIdAndUpdate(
          agent?._id,
          {
            $inc: { balance: -requestExists?.transactionAmount! },
          },
          { new: true }
        );
        await User.findByIdAndUpdate(
          requestExists?.requestSender,
          {
            $inc: { balance: requestExists?.transactionAmount! },
          },
          { new: true }
        );
        // Delete request
        await Request.findByIdAndDelete(requestExists?._id);
        // Create a transaction history for both sender and reciever
        const transactionData = {
          transactionAmount: requestExists?.transactionAmount!,
          receiver: requestExists?.requestSender,
          sender: requestExists?.requestReceiver,
          transactionType: "Cash In",
          status: "Success",
        };
        await Transaction.create([transactionData]);
        // Create notification for reciever
        const notificationData = {
          sender: requestExists?.requestSender,
          owner: requestExists?.requestReceiver,
          amount: requestExists?.transactionAmount!,
          notificationType: "Cash In",
        };
        await Notification.create([notificationData]);
        break;
      }
      case "Decline": {
        await Request.findByIdAndDelete(requestExists?._id);
        break;
      }
    }
    await session.commitTransaction();
    return true;
  } catch (error) {
    await session.abortTransaction();
    console.log("transaction failed", error);
    throw new CustomError(httpStatus.FORBIDDEN, "Transaction failed");
  } finally {
    await session.endSession();
  }
};

const AuthServices = {
  SendMoney,
  CashRequest,
  CashInRequestAction,
  CashOutRequestAction,
};
export default AuthServices;
