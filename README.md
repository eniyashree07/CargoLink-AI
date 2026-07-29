# CargoLINK - Logistics Management Platform

CargoLINK is a comprehensive logistics management platform that connects cargo owners with truck drivers for efficient cargo transportation. The platform features role-based dashboards, real-time tracking, and intelligent driver recommendations.

## 🏗️ Project Structure

```
CargoLINK/
├── frontend/              # React Frontend Application
│   ├── src/              # Source code
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── ...
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies
│   └── README.md         # Frontend documentation
└── backend/              # Node.js Backend API
    ├── models/           # MongoDB models
    ├── routes/           # API routes
    ├── middleware/       # Express middleware
    ├── server.js         # Server entry point
    ├── package.json      # Backend dependencies
    └── .env              # Environment variables
```

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **State Management:** React Hooks (useState, useEffect)
- **UI Components:** Custom components with Lucide React icons
- **Charts:** Recharts for data visualization
- **HTTP Client:** Fetch API with custom service layer

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Quick Start

### Step 1: Install MongoDB

**Option A: Local MongoDB**

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt install mongodb
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Update backend `.env` file with your connection string

### Step 2: Setup Backend

```bash
cd backend
npm install
```

**Configure Environment Variables:**

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cargolink
JWT_SECRET=cargolink-super-secret-key-change-in-production-min-256-bits-long!!
JWT_EXPIRE=24h
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cargolink?retryWrites=true&w=majority
```

**Start Backend Server:**

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Step 3: Setup Frontend

```bash
cd frontend
npm install
```

**Configure Environment Variables:**

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000
```

**Start Frontend Server:**

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Detailed Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB connection string
   - Update `JWT_SECRET` with a secure secret key

4. **Start the server:**
   ```bash
   npm run dev
   ```

5. **Verify backend is running:**
   - Open browser to `http://localhost:5000/api/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update `VITE_API_URL` with backend URL (default: `http://localhost:5000`)

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   - Navigate to `http://localhost:5173`
   - You should see the CargoLINK login page

## 🔧 Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/cargolink` |
| `JWT_SECRET` | Secret key for JWT tokens | `cargolink-super-secret-key...` |
| `JWT_EXPIRE` | JWT token expiration time | `24h` |
| `NODE_ENV` | Environment mode | `development` |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Dashboard

- `GET /api/dashboard/me` - Get dashboard for current user (requires auth)
- `GET /api/dashboard/owner` - Get owner dashboard (requires auth)
- `GET /api/dashboard/driver` - Get driver dashboard (requires auth)

### Trips

- `GET /api/trips` - Get all trips (requires auth)
- `GET /api/trips/:id` - Get trip by ID (requires auth)
- `POST /api/trips` - Create new trip (requires auth)
- `PUT /api/trips/:id` - Update trip (requires auth)
- `DELETE /api/trips/:id` - Delete trip (requires auth)
- `PATCH /api/trips/:id/assign-driver` - Assign driver to trip (requires auth)
- `PATCH /api/trips/:id/status` - Update trip status (requires auth)

### Drivers

- `GET /api/drivers` - Get all drivers (requires auth)
- `GET /api/drivers/available` - Get available drivers (requires auth)
- `GET /api/drivers/:id` - Get driver by ID (requires auth)
- `GET /api/drivers/user/:userId` - Get driver by user ID (requires auth)
- `POST /api/drivers` - Create driver (requires auth)
- `PUT /api/drivers/:id` - Update driver (requires auth)
- `DELETE /api/drivers/:id` - Delete driver (requires auth)

## 👥 User Roles

### Driver
- Can view available trips
- Can accept trip assignments
- Can update trip status
- Can view earnings

### Owner
- Can create and manage trips
- Can assign drivers to trips
- Can view all trips and drivers
- Can track shipments

### Admin
- Can view all platform data
- Can manage users
- Can access platform statistics

## 🔐 Authentication Flow

1. User registers or logs in via frontend
2. Frontend sends credentials to backend API
3. Backend validates credentials and generates JWT token
4. Backend returns JWT token and user data
5. Frontend stores JWT token in localStorage
6. Frontend includes JWT token in Authorization header for subsequent requests
7. Backend validates JWT token for protected routes

## 🧪 Testing the Application

### Test Backend API

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com",
    "password": "password123",
    "role": "DRIVER",
    "drivingLicence": "TN1120200042341",
    "truckNumber": "TN11AB1234",
    "vehicleType": "Mini Truck"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "john@example.com",
    "password": "password123"
  }'
```

**Test protected endpoint:**
```bash
curl -X GET http://localhost:5000/api/dashboard/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Frontend

1. Open browser to `http://localhost:5173`
2. Register as a new user (Driver, Owner, or Admin)
3. Login with registered credentials
4. Navigate to dashboard
5. Verify data loads from backend API

## 🚢 Deployment

### Backend Deployment

**Deploy to Render:**
1. Push code to GitHub
2. Connect repository to Render
3. Configure environment variables
4. Deploy automatically

**Deploy to Railway:**
1. Install Railway CLI
2. Login to Railway
3. Initialize project
4. Configure environment variables
5. Deploy

### Frontend Deployment

**Deploy to Vercel:**
```bash
cd frontend
npm install -g vercel
vercel
```

**Deploy to Netlify:**
```bash
cd frontend
npm run build
# Upload dist/ folder to Netlify
```

## 📝 Scripts

### Backend Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |

### Frontend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed:**
- Ensure MongoDB is running
- Check MongoDB connection string in `.env`
- Verify MongoDB service is started

**Port Already in Use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

**JWT Token Invalid:**
- Ensure JWT_SECRET is set in `.env`
- Check token expiration time
- Verify token is being sent in Authorization header

### Frontend Issues

**Failed to Fetch:**
- Ensure backend is running on correct port
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS is configured in backend

**Build Errors:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for missing dependencies in package.json

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is proprietary software for CargoLINK Logistics Platform.

## 📞 Support

For support and questions:
- Email: support@cargolink.com
- Documentation: See project wiki

## 🔗 Related Links

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Vite Documentation](https://vitejs.dev)

---

**Built with ❤️ for CargoLINK Logistics Platform**
