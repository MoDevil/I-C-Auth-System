# Authentication System

A secure, full-featured authentication system built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Registration & Login** - Secure signup and login endpoints
- **Password Hashing** - Bcryptjs for secure password storage
- **JWT Authentication** - Access tokens (10min) + Refresh tokens (1day)
- **Role-Based Access Control** - User and Admin roles
- **Protected Routes** - Middleware for route protection
- **Security Features**:
  - Rate limiting (prevents brute force attacks)
  - XSS protection
  - MongoDB injection protection
  - Input validation
  - Security headers with Helmet

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**

git clone https://github.com/yourusername/authentication-system.git
cd authentication-system

2. **Install dependencies**
npm install

3. **Environment Setup**
Create a `.env` file in the root directory:
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
MONGODB_URI=mongodb://localhost:27017/Authentication
PORT=3000

4. **Start the server**

Server will run on `http://localhost:3000`

## 🔌 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/auth/signup` | User registration | None |
| POST | `/api/auth/login` | User login | None |
| POST | `/api/auth/token` | Refresh access token | Refresh Token |
| POST | `/api/auth/logout` | User logout | Refresh Token |

### Protected Routes

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/profile` | Get user profile | Access Token |
| GET | `/api/admin` | Admin-only route | Access Token + Admin Role |

## 📝 Usage Examples

### Signup
curl -X POST http://localhost:3000/api/auth/signup
-H "Content-Type: application/json"
-d '{
"name": "testuser",
"password": "TestPass123",
"role": "user"
}'

### Login
curl -X POST http://localhost:3000/api/auth/login
-H "Content-Type: application/json"
-d '{
"name": "testuser",
"password": "TestPass123"
}'

### Access Protected Route

curl -X GET http://localhost:3000/api/profile
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"

text

## 🛡️ Security Features

- **Password Hashing**: Bcryptjs with salt rounds
- **Rate Limiting**: Max 5 auth attempts per 15 minutes
- **XSS Protection**: Input sanitization
- **SQL Injection Protection**: MongoDB sanitization
- **Input Validation**: Comprehensive validation rules
- **JWT Security**: Short-lived access tokens with refresh mechanism

## 🏗️ Project Structure


