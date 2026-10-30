# PayFlow

**A payments REST API where every transfer either completes fully or not at all.**

Built with Node.js, Express, MongoDB and Mongoose, with JWT authentication and Zod validation.

---

## Overview

PayFlow is a payments REST API that lets users manage accounts and transfer funds.
Users can register, sign in, update or delete profiles, search other users and
check balances, with an account created automatically at sign-up.

Every transfer runs in a session-based MongoDB multi-document
transaction with atomic balance updates. The updates commit together, or the
transaction aborts and rolls back on insufficient funds or a missing receiver, so
a payment is never left half-completed.

## Key Features

**Payments**
- Money transfer between users inside a MongoDB multi-document transaction
- Atomic balance updates: the debit and the credit commit together
- Automatic rollback when the sender has insufficient funds
- Automatic rollback when the receiver does not exist
- Balance lookup for the signed-in user

**Users and access**
- Sign-up with an account created automatically for every new user
- Sign-in with JWT, and Bearer-token protection on private routes
- Profile update (password, first name, last name) and profile delete
- User search by first or last name, case-insensitive

**Validation and errors**
- Zod schemas for sign-up, sign-in and profile updates
- Clear HTTP status codes: 400, 401, 403, 404, 409 and 500
- Duplicate sign-ups are rejected with a 409 response

## Architecture

The API follows a simple layered structure. Each layer has one job.

``` text
 Client
   |
   v
------------------------------------------------
| Express app (index.js)                       |
| JSON parsing, CORS, route mounting           |
------------------------------------------------
                        |
                        v
------------------------------------------------
| Routes  /api/v1/user   /api/v1/account       |
------------------------------------------------
                        |
                        v
------------------------------------------------
| Auth middleware (JWT Bearer token check)     |
------------------------------------------------
                        |
                        v
------------------------------------------------
| Controllers + Zod validation                 |
------------------------------------------------
                        |
                        v
------------------------------------------------
| Mongoose models  ->  MongoDB Atlas           |
------------------------------------------------
```

| Layer | Responsibility |
| --- | --- |
| Routes | Map each URL and method to a controller |
| Middleware | Verify the Bearer token and attach the user ID to the request |
| Controllers | Handle the request, validate input and return the response |
| Models | Define the User and Account schemas in MongoDB |

## How a Transfer Works

The transfer is the core of the app, so it is worth walking through.

```text
 POST /api/v1/account/transfer  { to, amount }
    |
    v
 Start session and start transaction
    |
    v
 Find the sender account
    |-- balance too low or missing --> abort transaction --> 400
    |
    v
 Find the receiver account
    |-- not found -------------------> abort transaction --> 404
    |
    v
 Debit the sender   (atomic $inc, -amount)
 Credit the receiver (atomic $inc, +amount)
    |
    v
 Commit transaction --> 200
    |
    v
 End session (always, even after an error)
```

- Both balance updates use MongoDB's atomic `$inc` inside the same session.
- If anything throws, the catch block aborts the transaction and returns a 500, so
  no partial change is ever saved.
- The session is closed in a `finally` block, whatever the outcome.

## API Reference

All routes are under `/api/v1`. Routes marked **Yes** need the header
`Authorization: Bearer <token>`.

### User

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| POST | `/user/signup` | No | Create a user and an account, return a JWT |
| POST | `/user/signin` | No | Sign in and return a JWT |
| PUT | `/user/update` | Yes | Update password, first name or last name |
| DELETE | `/user/delete` | Yes | Delete the signed-in user |
| GET | `/user/bulk?filter=` | No | Search users by first or last name |

### Account

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/account/balance` | Yes | Get the signed-in user's balance |
| POST | `/account/transfer` | Yes | Transfer money to another user |

### Example transfer request

```json
POST /api/v1/account/transfer
Authorization: Bearer <token>

{
  "to": "<receiver user id>",
  "amount": 100
}
```

### Status codes

| Code | Meaning |
| --- | --- |
| 200 / 201 | Success |
| 400 | Invalid input or insufficient balance |
| 401 | Missing token or invalid credentials |
| 403 | Invalid or forbidden token |
| 404 | Receiver does not exist |
| 409 | User with this email already exists |
| 500 | Server error, transaction aborted |

## Data Model

| Model | Fields | Notes |
| --- | --- | --- |
| User | `username`, `password`, `firstName`, `lastName` | `username` is a unique email, lowercase and trimmed |
| Account | `userId`, `balance` | `userId` references the User, one account per user |

Validation rules live in two places: Zod checks the request body (email format,
minimum lengths), and the Mongoose schema enforces length limits and uniqueness.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Runtime and framework | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose |
| Transactions | MongoDB sessions, multi-document transactions |
| Authentication | JWT (`jsonwebtoken`), Bearer tokens |
| Validation | Zod |
| Other | CORS, dotenv |

## Project Structure

```text
payflow/
--- index.js                 app entry point
--- src/
    -- routes/              routes.js, user.js, account.js
    -- controller/
    |    -- user/            signup, signin, update, delete, search
    |    -- account/         balance, transfer
    -- middleware/          authMiddleware.js
    -- models/              user.js, account.js
    -- validation/          sign-up, sign-in and update schemas
    -- db/                  db.js (MongoDB connection)
```

## Getting Started

**Prerequisites:** Node.js and a MongoDB Atlas cluster. Transactions need a
replica set, which Atlas provides by default.

```bash
git clone <your-repo-url> && cd payflow
npm install
node index.js
```

Create a `.env` file in the project root first.

## Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | Server port (default 3000) |
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify tokens |

## Roadmap

- [ ] Build a frontend (React) for sign-up, sign-in, balance, user search and transfers
- [ ] Support more than one account per user, with transfers between a user’s own accounts

## Author

Built by **Vaibhav Chavhan** | [GitHub](https://github.com/vaibhavchavhan45) | [LinkedIn](https://www.linkedin.com/in/vaibhavchavhan/) | [Portfolio](https://vaibhav-chavhan.vercel.app) | Email: [chavhanvaibhav708@gmail.com](mailto:chavhanvaibhav708@gmail.com)