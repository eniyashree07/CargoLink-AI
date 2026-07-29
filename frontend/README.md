# CargoLINK - Logistics Management Platform

CargoLINK is a comprehensive logistics management platform built with React that connects cargo owners with truck drivers for efficient cargo transportation. The platform features role-based dashboards, real-time tracking, and intelligent driver recommendations.

## 🚀 Features

### For Cargo Owners
- Create and manage cargo shipments
- Track shipments in real-time
- AI-powered driver recommendations
- View trip history and analytics
- Manage driver assignments

### For Drivers
- View available cargo loads
- Accept trip assignments
- Track earnings and performance
- Real-time navigation support
- Manage availability status

### For Admins
- Overview of all platform activities
- User management
- System analytics and reports
- Monitor fleet operations

## 🛠️ Technology Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **State Management:** React Hooks (useState, useEffect)
- **UI Components:** Custom components with Lucide React icons
- **Charts:** Recharts for data visualization
- **HTTP Client:** Fetch API with custom service layer
- **Styling:** CSS with modular approach

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Backend API** running on `http://localhost:8080` (if using full stack)

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd CargoLINK
```

### Step 2: Install Dependencies

```bash
npm install
```

Or if using yarn:

```bash
yarn install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080
```

**Note:** The `.env.example` file is provided as a template.

## 🚀 Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will be available at:
- **Default:** `http://localhost:5173`
- **Network:** Use the IP address shown in terminal for mobile testing

### Production Build

Build for production:

```bash
npm run build
```

Or with yarn:

```bash
yarn build
```

The optimized files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

Or with yarn:

```bash
yarn preview
```

## 📁 Project Structure

```
CargoLINK/
├── public/                 # Static assets
│   ├── favicon.ico
│   └── ...
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── StatCard.jsx
│   │   ├── TripCard.jsx
│   │   ├── DriverCard.jsx
│   │   ├── NotificationCard.jsx
│   │   └── QuickServiceCard.jsx
│   ├── pages/              # Page components
│   │   ├── LoginPage.jsx
│   │   ├── OwnerDashboard.jsx
│   │   ├── DriverDashboard.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/           # API service layer
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── dashboardService.js
│   │   ├── tripService.js
│   │   └── driverService.js
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── .env                    # Environment variables
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080` |

### Vite Configuration

The `vite.config.js` file contains Vite-specific settings for the React application.

## 📄 Component Documentation

### Components

#### 1. Sidebar.jsx
**Purpose:** Navigation sidebar for dashboards
**Features:**
- Role-based navigation items
- Collapsible design
- Active route highlighting
- Icons for visual navigation

#### 2. Header.jsx
**Purpose:** Top header with user info and actions
**Features:**
- User greeting
- Role display
- Notification bell
- Profile menu
- Dark mode toggle

#### 3. StatCard.jsx
**Purpose:** Display statistics in card format
**Features:**
- Icon display
- Value and label
- Color-coded based on metric type
- Hover effects

#### 4. TripCard.jsx
**Purpose:** Display trip information
**Features:**
- Trip details (origin, destination, cargo type)
- Status indicators
- Driver assignment info
- Action buttons

#### 5. DriverCard.jsx
**Purpose:** Display driver information
**Features:**
- Driver profile details
- Rating display
- Availability status
- Vehicle information

#### 6. NotificationCard.jsx
**Purpose:** Display notifications
**Features:**
- Notification title and message
- Read/unread status
- Timestamp
- Type-based styling

#### 7. QuickServiceCard.jsx
**Purpose:** Quick access to services
**Features:**
- Service icon and name
- Quick action buttons
- Status indicators

### Pages

#### 1. LoginPage.jsx
**Purpose:** User authentication and registration
**Features:**
- Login form with email/mobile
- Registration forms for Driver, Owner, Admin
- Role-specific fields
- Form validation
- Error handling
- Loading states
- JWT token storage

**Key Functionality:**
- Uses `authService` for API calls
- Stores user data and JWT in localStorage
- Redirects to appropriate dashboard based on role
- Handles registration for different user roles

#### 2. OwnerDashboard.jsx
**Purpose:** Cargo owner's main dashboard
**Features:**
- Overview statistics
- Active trips management
- Driver recommendations
- Load creation
- Live tracking view
- Notifications
- Settings

**Key Functionality:**
- Fetches data from `dashboardService`, `tripService`, `driverService`
- Displays trip statistics
- AI driver recommendations
- Trip assignment interface
- Real-time tracking simulation

#### 3. DriverDashboard.jsx
**Purpose:** Driver's main dashboard
**Features:**
- Current trip details
- Earnings overview
- Available loads
- Notifications
- Quick services
- Navigation support

**Key Functionality:**
- Fetches data from `dashboardService` and `tripService`
- Displays current trip status
- Shows earnings chart
- Available load recommendations

#### 4. AdminDashboard.jsx
**Purpose:** Admin dashboard for platform oversight
**Features:**
- Platform statistics
- User management
- System monitoring
- Reports and analytics

### Services

#### 1. api.js
**Purpose:** Generic HTTP client with JWT management
**Features:**
- Base URL configuration
- Automatic token attachment
- Request/response handling
- Error handling
- Token storage management

**Methods:**
- `get(endpoint)` - GET requests
- `post(endpoint, body)` - POST requests
- `put(endpoint, body)` - PUT requests
- `patch(endpoint, body)` - PATCH requests
- `delete(endpoint)` - DELETE requests
- `getToken()` - Retrieve JWT
- `setToken(token)` - Store JWT
- `clearToken()` - Remove JWT

#### 2. authService.js
**Purpose:** Authentication API calls
**Features:**
- User registration
- User login
- Current user retrieval
- Logout functionality

**Methods:**
- `login(identifier, password)` - Authenticate user
- `register(userData)` - Register new user
- `getCurrentUser()` - Get current user
- `logout()` - Clear authentication
- `isAuthenticated()` - Check auth status

#### 3. dashboardService.js
**Purpose:** Dashboard data API calls
**Features:**
- Role-specific dashboard data
- Statistics aggregation

**Methods:**
- `getGeneralDashboard()` - General dashboard
- `getAdminDashboard()` - Admin dashboard
- `getOwnerDashboard()` - Owner dashboard
- `getDriverDashboard()` - Driver dashboard

#### 4. tripService.js
**Purpose:** Trip management API calls
**Features:**
- CRUD operations for trips
- Driver assignment
- Status updates

**Methods:**
- `getAllTrips()` - Get all trips
- `getTripById(id)` - Get trip by ID
- `getTripsByOwner(cargoOwnerId)` - Get owner's trips
- `getTripsByDriver(driverId)` - Get driver's trips
- `createTrip(tripData)` - Create trip
- `updateTrip(id, tripData)` - Update trip
- `deleteTrip(id)` - Delete trip
- `assignDriver(tripId, driverId)` - Assign driver
- `updateTripStatus(tripId, status)` - Update status

#### 5. driverService.js
**Purpose:** Driver management API calls
**Features:**
- Driver CRUD operations
- Availability queries

**Methods:**
- `getAllDrivers()` - Get all drivers
- `getAvailableDrivers()` - Get available drivers
- `getDriverById(id)` - Get driver by ID
- `getDriverByUserId(userId)` - Get driver by user ID
- `createDriver(driverData)` - Create driver
- `updateDriver(id, driverData)` - Update driver
- `deleteDriver(id)` - Delete driver

## 🔐 Authentication Flow

1. User fills registration/login form
2. Frontend calls `authService.register()` or `authService.login()`
3. API client (`api.js`) attaches JWT token to request
4. Backend validates and returns JWT token + user data
5. Frontend stores JWT token in localStorage
6. User is redirected to appropriate dashboard based on role

## 🎨 Styling

The application uses modular CSS with:
- Component-specific styles
- Responsive design
- Dark mode support
- Custom color schemes for different roles

## 🌐 API Integration

The frontend is configured to connect to a backend API. All API calls go through the service layer which handles:
- JWT token management
- Request formatting
- Error handling
- Response parsing

**Base URL:** Configured via `VITE_API_URL` environment variable

**Default:** `http://localhost:8080`

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🧪 Testing

To test the application:

1. Start the development server
2. Open browser to `http://localhost:5173`
3. Test registration for different roles
4. Test login functionality
5. Verify dashboard navigation
6. Test API integration (if backend is running)

## 🚢 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### Deploy to GitHub Pages

```bash
npm run build
# Configure GitHub Pages to serve from dist/
```

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run linter |

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
- [Vite Documentation](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)
- [Recharts](https://recharts.org)

---

**Built with ❤️ for CargoLINK Logistics Platform**
