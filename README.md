# Demo Payment App Backend

A RESTful backend API payment app, built using the MERN stack (without React).

## Tech Stack
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT Authentication
- Zod Validation

## Features
- User signup/signin with JWT
- Update & delete user
- Search users by name
- Account balance fetch
- Money transfer with MongoDB transactions

## API Routes

### User
- POST /api/v1/user/signup
- POST /api/v1/user/signin
- PUT  /api/v1/user/update
- DELETE /api/v1/user/delete
- GET /api/v1/user/bulk?filter=

### Account
- GET /api/v1/account/balance
- POST /api/v1/account/transfer

## Setup
1. Clone the repo
2. Run `npm install`
3. Add `.env` file with `PORT`, `MONGO_URL`, `JWT_SECRET`
4. Run `node index.js`