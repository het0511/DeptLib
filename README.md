# Library Management System

A full-stack application for managing a departmental library system. Users can browse, purchase, and borrow books, with QR code generation for verification.

## Features

- User authentication (login/register)
- Browse books by department
- Search for books
- Purchase and borrow books
- QR code generation for transactions
- Book return functionality
- Transaction history

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Zustand for state management
- Tailwind CSS for styling
- Axios for API communication
- QRCode.react for QR code generation

### Backend
- Java Spring Boot
- Spring Security with JWT authentication
- Spring Data JPA for database access
- H2 in-memory database (can be replaced with MySQL, PostgreSQL, etc.)

## Running the Application

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend

```bash
# Navigate to backend directory
cd backend

# Build and run with Maven
./mvnw spring-boot:run
```

## Default Users

The application comes with two pre-configured users:

1. Admin User
   - Email: admin@example.com
   - Password: password

2. Regular User
   - Email: user@example.com
   - Password: password

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login a user
- GET /api/auth/me - Get current user details

### Books
- GET /api/books - Get all books
- GET /api/books?department={department} - Get books by department
- GET /api/books/{id} - Get book by ID
- GET /api/books/search?query={query} - Search books

### Transactions
- GET /api/transactions/user - Get current user's transactions
- GET /api/transactions/{id} - Get transaction by ID
- POST /api/transactions/purchase - Purchase a book
- POST /api/transactions/borrow - Borrow a book
- POST /api/transactions/{id}/return - Return a borrowed book