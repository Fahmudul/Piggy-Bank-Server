# Mobile Financial Service (MFS) Web Application

## Overview
This project is a **Mobile Financial Service (MFS) Web Application** inspired by platforms like **bKash** and **Nagad**. The system supports secure transactions, user authentication, balance management, and role-based access control.

## Technologies Used
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ORM
- **Authentication:** JWT-based secure authentication
- **Security:** Hashed PINs for user authentication

## Features Implemented
### **Account Management**
- User and Agent registration with unique **Mobile Number, Email, and NID**.
- Role-based system:
  - **User**: Can send money, cash-in, cash-out, and check balance.
  - **Agent**: Can approve cash-in transactions and request balance recharges.
  - **Admin**: Can manage users, approve agents, and monitor system transactions.
- **JWT Authentication** with secure route handling.
- **Single Device Login Restriction**.

### **Transaction Features**
#### **Send Money (User)**
- Minimum amount: **50 Taka**.
- Transactions above **100 Taka** incur a **5 Taka** fee.
- **Real-time balance updates** for sender and receiver.
- **Admin receives 5 Taka per transaction**.

#### **Cash-Out (User)**
- Cash-out through authorized agents.
- **1.5% fee on cash-out transactions**.
- **Agent earns 1% commission**.
- **Admin earns 0.5% commission**.
- Real-time balance updates and transaction history.

#### **Cash-In (Agent)**
- Users can cash-in via agents with **zero fees**.
- Requires **Agent PIN for security**.
- **Admin does not earn from cash-in transactions**.
- Real-time balance updates and notifications.

### **Balance Inquiry**
- **User & Agent balances are initially blurred**.
- Click-to-view feature for balance visibility.
- **Admin dashboard displays total system funds & earnings**.

### **Admin Features**
- **User & Agent Management**:
  - View balances & transactions.
  - Block users or agents if needed.
  - Search users by phone number.
- **Agent Approval System**:
  - View & approve/reject agent registration requests.
  - Tabular representation of pending approvals.
- **Transaction Monitoring**:
  - Users & agents can see the last **100 transactions**.
  - Admin can view transactions for all users and agents.

## Installation & Setup
### **Prerequisites**
Ensure you have the following installed:
- Node.js
- MongoDB

### **Backend Setup**
```bash
cd backend
npm install
npm start
```

### **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

## API Endpoints
| Method | Endpoint             | Description                        |
|--------|----------------------|------------------------------------|
| POST   | /api/auth/register   | User & Agent Registration         |
| POST   | /api/auth/login      | User, Agent & Admin Login         |
| POST   | /api/transactions/send-money | Send Money Transaction |
| POST   | /api/transactions/cash-in   | Cash-In Transaction |
| POST   | /api/transactions/cash-out  | Cash-Out Transaction |
| GET    | /api/balance         | Get User/Agent/Admin Balance      |
| GET    | /api/admin/users     | Admin User Management             |
| GET    | /api/admin/agents    | Admin Agent Approval              |

## Security Measures
- **JWT authentication for API protection**.
- **Hashed PINs using bcrypt**.
- **Role-based access control**.
- **Single device login enforcement**.

## Conclusion
This project successfully implements a **secure and user-friendly MFS application**, providing essential features like authentication, transactions, and role-based access. The system ensures **security, efficiency, and scalability**, making it suitable for real-world financial operations.

### **Author**
[Your Name]

---
**Note:** This is a skill assessment project demonstrating technical abilities in **full-stack web development**.

