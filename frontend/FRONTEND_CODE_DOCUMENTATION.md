# Frontend Code Documentation - CargoLINK

This document provides detailed explanations for each file in the CargoLINK frontend project.

## Table of Contents

1. [Root Configuration Files](#root-configuration-files)
2. [Source Files](#source-files)
   - [Main Entry Point](#main-entry-point)
   - [App Component](#app-component)
   - [Components](#components)
   - [Pages](#pages)
   - [Services](#services)
   - [Styles](#styles)

---

## Root Configuration Files

### package.json
**Purpose:** Project dependencies and scripts configuration

**Key Sections:**
- **name:** "cargolink" - Project name
- **version:** "0.0.0" - Project version
- **type:** "module" - ES modules support
- **scripts:** 
  - `dev` - Start development server with Vite
  - `build` - Build for production
  - `lint` - Run Oxlint linter
  - `preview` - Preview production build
- **dependencies:**
  - `react` - React library
  - `react-dom` - React DOM renderer
  - `react-router-dom` - Routing library
  - `lucide-react` - Icon library
  - `recharts` - Chart library
- **devDependencies:**
  - `@vitejs/plugin-react` - Vite React plugin
  - `vite` - Build tool
  - `oxlint` - Linter

**Explanation:** This file defines all the packages needed to run the project and provides convenient scripts for development and building.

### vite.config.js
**Purpose:** Vite build tool configuration

**Content:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**Explanation:** 
- Imports Vite and React plugin
- Configures Vite to use the React plugin
- This enables fast development server and optimized production builds

### index.html
**Purpose:** HTML entry point for the application

**Key Elements:**
- `<div id="root"></div>` - Root element where React app mounts
- `<script type="module" src="/src/main.jsx"></script>` - Entry point script
- Meta tags for viewport and character encoding

**Explanation:** This is the only HTML file in the project. React renders everything inside the root div.

### .env
**Purpose:** Environment variables for development

**Content:**
```
VITE_API_URL=http://localhost:5000
```

**Explanation:** 
- Defines the backend API URL
- Variables prefixed with `VITE_` are accessible in frontend code
- Used by the API service to make HTTP requests

### .env.example
**Purpose:** Template for environment variables

**Content:** Same as .env but serves as a template for other developers

**Explanation:** This file should be committed to git while .env should be in .gitignore to protect sensitive data.

### .gitignore
**Purpose:** Specifies files to ignore in git

**Key Patterns:**
- `node_modules/` - Dependencies
- `dist/` - Build output
- `.env` - Environment variables with sensitive data
- `.DS_Store` - macOS system files

**Explanation:** Prevents unnecessary files from being committed to version control.

---

## Source Files

### Main Entry Point

### src/main.jsx
**Purpose:** Application entry point and React initialization

**Code:**
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Explanation:**
- Imports React and ReactDOM for rendering
- Imports the main App component
- Imports global CSS styles
- Creates a React root in the HTML element with id "root"
- Renders the App component wrapped in StrictMode for development checks

### App Component

### src/App.jsx
**Purpose:** Main application component with routing configuration

**Code Structure:**
```javascript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import OwnerDashboard from './pages/OwnerDashboard'
import DriverDashboard from './pages/DriverDashboard'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/owner" element={<OwnerDashboard />} />
        <Route path="/dashboard/driver" element={<DriverDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/driver-app" element={<DriverDashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}
```

**Explanation:**
- Sets up React Router for client-side routing
- Defines routes for different pages:
  - `/login` - Login/registration page
  - `/dashboard/owner` - Owner dashboard
  - `/dashboard/driver` - Driver dashboard
  - `/dashboard/admin` - Admin dashboard
  - `/driver-app` - Alternative driver app route
  - `/` - Redirects to login by default
- Uses Navigate component for automatic redirects

---

## Components

### src/components/Sidebar.jsx
**Purpose:** Navigation sidebar for dashboards

**Key Features:**
- Accepts `role` prop to customize navigation items
- Collapsible design with state management
- Active route highlighting
- Icons from Lucide React for visual navigation

**Props:**
- `role`: "driver" | "owner" | "admin" - Determines which navigation items to show

**Explanation:**
- Renders different navigation items based on user role
- Uses state to track active navigation item
- Provides visual feedback for current route
- Includes icons for better UX

### src/components/Header.jsx
**Purpose:** Top header with user information and actions

**Key Features:**
- User greeting with name
- Role display badge
- Notification bell with count
- Profile menu dropdown
- Dark mode toggle

**Props:**
- `title`: Page title
- `userRole`: Current user's role

**Explanation:**
- Displays contextual information based on current page
- Provides quick access to user actions
- Includes notification indicator
- Supports dark mode switching

### src/components/StatCard.jsx
**Purpose:** Display statistics in a card format

**Props:**
- `icon`: Lucide icon component
- `value`: Numeric value to display
- `label`: Description of the statistic
- `color`: Color theme for the card

**Explanation:**
- Reusable component for displaying metrics
- Uses icons for visual representation
- Color-coded for different types of statistics
- Hover effects for interactivity

### src/components/TripCard.jsx
**Purpose:** Display trip information in card format

**Props:**
- `trip`: Trip object with details
- `onAssign`: Callback for assigning driver
- `onView`: Callback for viewing details

**Key Data Displayed:**
- Origin and destination
- Cargo type and weight
- Status indicator
- Driver assignment info
- Action buttons

**Explanation:**
- Shows comprehensive trip information
- Status badges for quick identification
- Action buttons for common operations
- Responsive layout for different screen sizes

### src/components/DriverCard.jsx
**Purpose:** Display driver information in card format

**Props:**
- `driver`: Driver object with details
- `onAssign`: Callback for assigning to trip

**Key Data Displayed:**
- Driver name and photo
- Rating stars
- Availability status
- Vehicle information
- Experience details

**Explanation:**
- Highlights driver qualifications
- Shows availability for quick decision making
- Rating system for quality assessment
- Vehicle details for trip matching

### src/components/NotificationCard.jsx
**Purpose:** Display notifications in card format

**Props:**
- `notification`: Notification object
- `onRead`: Callback for marking as read

**Key Data Displayed:**
- Notification title
- Message content
- Timestamp
- Read/unread indicator
- Type-based styling

**Explanation:**
- Distinguishes between read and unread notifications
- Time-based ordering
- Type-specific styling (info, warning, success)
- Quick action to mark as read

### src/components/QuickServiceCard.jsx
**Purpose:** Quick access to common services

**Props:**
- `service`: Service object with details
- `onClick`: Callback for service action

**Key Data Displayed:**
- Service icon
- Service name
- Status indicator
- Quick action button

**Explanation:**
- Provides one-click access to common services
- Visual indicators for service status
- Consistent design across different services

---

## Pages

### src/pages/LoginPage.jsx
**Purpose:** User authentication and registration page

**Key Features:**
- Login form with email/mobile identifier
- Registration forms for three roles: Driver, Owner, Admin
- Form validation with error messages
- Loading states during API calls
- JWT token storage in localStorage
- Role-based redirection after successful auth

**State Management:**
```javascript
const [isLogin, setIsLogin] = useState(true)
const [activeRegisterTab, setActiveRegisterTab] = useState('driver')
const [isLoading, setIsLoading] = useState(false)
const [errorMessage, setErrorMessage] = useState('')
const [successMessage, setSuccessMessage] = useState('')
```

**Key Functions:**

**handleLoginSubmit:**
- Validates login form inputs
- Calls `authService.login()` with credentials
- Stores JWT token and user data in localStorage
- Redirects to appropriate dashboard based on role
- Handles errors with user-friendly messages

**handleRegisterSubmit:**
- Validates registration form based on role
- Calls `authService.register()` with role-specific data
- Stores JWT token and user data in localStorage
- Redirects to appropriate dashboard
- Handles errors with specific messages

**Role-Specific Registration:**
- **Driver:** Requires driving licence, truck number, vehicle type
- **Owner:** Requires company name, GST number, company address
- **Admin:** Requires employee ID

**API Integration:**
- Uses `authService` for all authentication calls
- Automatic token management via `api.js`
- Error handling with try-catch blocks

**Explanation:**
This is the entry point for users. It handles both authentication (login) and onboarding (registration). The page dynamically shows different registration forms based on the selected role. All authentication data is stored in localStorage for session persistence.

### src/pages/OwnerDashboard.jsx
**Purpose:** Main dashboard for cargo owners

**Key Features:**
- Overview statistics (total trips, active trips, etc.)
- Active trips management with status tracking
- AI-powered driver recommendations
- Load/trip creation form
- Live tracking view for in-transit trips
- Notifications panel
- Settings page

**State Management:**
```javascript
const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
const [activeNav, setActiveNav] = useState('overview')
const [dashboardData, setDashboardData] = useState(null)
const [trips, setTrips] = useState([])
const [drivers, setDrivers] = useState([])
const [isLoading, setIsLoading] = useState(false)
```

**Data Fetching:**
```javascript
useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const data = await dashboardService.getOwnerDashboard()
      setDashboardData(data)
      const tripsData = await tripService.getAllTrips()
      setTrips(tripsData)
      const driversData = await driverService.getAllDrivers()
      setDrivers(driversData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  fetchData()
}, [])
```

**Navigation Views:**
- **Overview:** Main statistics and recent activity
- **Trips:** All trips with filtering and management
- **Drivers:** Driver management and assignment
- **Create Load:** Form to create new trips
- **Live Tracking:** Real-time tracking of active trips
- **Notifications:** User notifications
- **Settings:** User preferences and profile

**Key Components:**
- Stat cards for quick metrics
- Trip cards for trip management
- Driver cards for driver selection
- AI recommendation system for driver matching
- Map integration for live tracking

**API Integration:**
- `dashboardService.getOwnerDashboard()` - Dashboard statistics
- `tripService.getAllTrips()` - All trips data
- `driverService.getAllDrivers()` - All drivers data
- `driverService.getAvailableDrivers()` - Available drivers for assignment

**Explanation:**
This is the main workspace for cargo owners. It provides a comprehensive view of their logistics operations. The dashboard fetches real-time data from the backend and displays it in an intuitive interface. The AI recommendation system suggests the best drivers for each trip based on various factors.

### src/pages/DriverDashboard.jsx
**Purpose:** Main dashboard for truck drivers

**Key Features:**
- Current trip details with status
- Earnings overview with chart
- Available loads to accept
- Notifications panel
- Quick services (fuel, parking, food, maintenance)
- Navigation support

**State Management:**
```javascript
const [dashboardData, setDashboardData] = useState(null)
const [trips, setTrips] = useState([])
const [isLoading, setIsLoading] = useState(false)
```

**Data Fetching:**
```javascript
useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const data = await dashboardService.getDriverDashboard()
      setDashboardData(data)
      const tripsData = await tripService.getAllTrips()
      setTrips(tripsData)
    } catch (error) {
      console.error('Failed to fetch driver dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  fetchData()
}, [])
```

**Key Sections:**
- **Current Trip:** Details of active trip with status
- **Earnings:** Weekly earnings chart using Recharts
- **Available Loads:** List of available trips to accept
- **Notifications:** Driver-specific notifications
- **Quick Services:** One-click access to common services

**Earnings Chart:**
- Uses Recharts LineChart component
- Displays earnings over the week
- Responsive design for different screens

**API Integration:**
- `dashboardService.getDriverDashboard()` - Driver-specific statistics
- `tripService.getAllTrips()` - Available trips data

**Explanation:**
This dashboard is optimized for drivers who are often on the move. It provides quick access to current trip information, earnings, and available loads. The interface is designed for easy use on mobile devices with large touch targets and clear information hierarchy.

### src/pages/AdminDashboard.jsx
**Purpose:** Admin dashboard for platform oversight

**Key Features:**
- Platform-wide statistics
- User management
- System monitoring
- Reports and analytics
- Fleet operations overview

**Explanation:**
This dashboard provides administrators with a bird's-eye view of the entire platform. It includes comprehensive analytics and management tools for overseeing all operations.

---

## Services

### src/services/api.js
**Purpose:** Generic HTTP client with JWT token management

**Key Features:**
- Base URL configuration from environment variables
- Automatic JWT token attachment to requests
- Generic request methods for all HTTP methods
- Error handling with user-friendly messages
- Token storage management in localStorage

**Class Structure:**
```javascript
class ApiClient {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  }

  getToken() {
    return localStorage.getItem('cargolink_token')
  }

  setToken(token) {
    localStorage.setItem('cargolink_token', token)
  }

  clearToken() {
    localStorage.removeItem('cargolink_token')
  }

  async request(endpoint, options = {}) {
    // Implementation
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}
```

**Request Method:**
```javascript
async request(endpoint, options = {}) {
  const url = `${this.baseUrl}${endpoint}`
  const token = this.getToken()

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
```

**Explanation:**
This is the foundation of all API communication in the application. It abstracts away the complexity of HTTP requests and JWT token management. All other services use this client to communicate with the backend. The automatic token attachment ensures authenticated requests work seamlessly.

### src/services/authService.js
**Purpose:** Authentication-specific API calls

**Key Methods:**

**login(identifier, password):**
```javascript
async login(identifier, password) {
  const response = await apiClient.post('/api/auth/login', {
    identifier,
    password,
  })
  apiClient.setToken(response.token)
  return response
}
```

**register(userData):**
```javascript
async register(userData) {
  const response = await apiClient.post('/api/auth/register', userData)
  apiClient.setToken(response.token)
  return response
}
```

**getCurrentUser():**
```javascript
async getCurrentUser() {
  return await apiClient.get('/api/auth/me')
}
```

**logout():**
```javascript
logout() {
  apiClient.clearToken()
  localStorage.removeItem('cargolink_user')
}
```

**isAuthenticated():**
```javascript
isAuthenticated() {
  return !!apiClient.getToken()
}
```

**getToken():**
```javascript
getToken() {
  return apiClient.getToken()
}
```

**Explanation:**
This service handles all authentication-related operations. It wraps the generic API client with authentication-specific logic. After successful login or registration, it automatically stores the JWT token for future requests. The logout method clears both the token and user data from localStorage.

### src/services/dashboardService.js
**Purpose:** Dashboard data API calls

**Key Methods:**

**getGeneralDashboard():**
```javascript
async getGeneralDashboard() {
  return await apiClient.get('/api/dashboard/me')
}
```

**getAdminDashboard():**
```javascript
async getAdminDashboard() {
  return await apiClient.get('/api/dashboard/admin')
}
```

**getOwnerDashboard():**
```javascript
async getOwnerDashboard() {
  return await apiClient.get('/api/dashboard/owner/me')
}
```

**getDriverDashboard():**
```javascript
async getDriverDashboard() {
  return await apiClient.get('/api/dashboard/driver/me')
}
```

**Explanation:**
This service provides methods to fetch dashboard data for different user roles. Each method calls a specific endpoint that returns role-appropriate statistics and data. The backend handles the data filtering based on the authenticated user's role and JWT token.

### src/services/tripService.js
**Purpose:** Trip management API calls

**Key Methods:**

**getAllTrips():**
```javascript
async getAllTrips() {
  return await apiClient.get('/api/trips')
}
```

**getTripById(id):**
```javascript
async getTripById(id) {
  return await apiClient.get(`/api/trips/${id}`)
}
```

**getTripsByOwner(cargoOwnerId):**
```javascript
async getTripsByOwner(cargoOwnerId) {
  return await apiClient.get(`/api/trips/owner/${cargoOwnerId}`)
}
```

**getTripsByDriver(driverId):**
```javascript
async getTripsByDriver(driverId) {
  return await apiClient.get(`/api/trips/driver/${driverId}`)
}
```

**createTrip(tripData):**
```javascript
async createTrip(tripData) {
  return await apiClient.post('/api/trips', tripData)
}
```

**updateTrip(id, tripData):**
```javascript
async updateTrip(id, tripData) {
  return await apiClient.put(`/api/trips/${id}`, tripData)
}
```

**deleteTrip(id):**
```javascript
async deleteTrip(id) {
  return await apiClient.delete(`/api/trips/${id}`)
}
```

**assignDriver(tripId, driverId):**
```javascript
async assignDriver(tripId, driverId) {
  return await apiClient.patch(`/api/trips/${tripId}/assign-driver`, { driverId })
}
```

**updateTripStatus(tripId, status):**
```javascript
async updateTripStatus(tripId, status) {
  return await apiClient.patch(`/api/trips/${tripId}/status`, { status })
}
```

**Explanation:**
This service provides a complete CRUD interface for trip management. It includes methods for creating, reading, updating, and deleting trips. Special methods for assigning drivers and updating status handle business logic that requires specific endpoint calls. All methods automatically include the JWT token for authentication.

### src/services/driverService.js
**Purpose:** Driver management API calls

**Key Methods:**

**getAllDrivers():**
```javascript
async getAllDrivers() {
  return await apiClient.get('/api/drivers')
}
```

**getAvailableDrivers():**
```javascript
async getAvailableDrivers() {
  return await apiClient.get('/api/drivers/available')
}
```

**getDriverById(id):**
```javascript
async getDriverById(id) {
  return await apiClient.get(`/api/drivers/${id}`)
}
```

**getDriverByUserId(userId):**
```javascript
async getDriverByUserId(userId) {
  return await apiClient.get(`/api/drivers/user/${userId}`)
}
```

**createDriver(driverData):**
```javascript
async createDriver(driverData) {
  return await apiClient.post('/api/drivers', driverData)
}
```

**updateDriver(id, driverData):**
```javascript
async updateDriver(id, driverData) {
  return await apiClient.put(`/api/drivers/${id}`, driverData)
}
```

**deleteDriver(id):**
```javascript
async deleteDriver(id) {
  return await apiClient.delete(`/api/drivers/${id}`)
}
```

**Explanation:**
This service manages all driver-related operations. It provides methods to query drivers by various criteria (all, available, by ID, by user ID) and perform CRUD operations. The `getAvailableDrivers` method is particularly important for the owner dashboard's driver recommendation system.

---

## Styles

### src/index.css
**Purpose:** Global CSS styles and resets

**Key Sections:**

**CSS Reset:**
- Removes default browser styles
- Sets box-sizing to border-box
- Removes margins and padding

**Global Variables:**
- Color palette for different themes
- Spacing variables
- Typography settings

**Utility Classes:**
- Flexbox and grid utilities
- Text alignment classes
- Margin and padding utilities

**Explanation:**
This file contains global styles that apply to the entire application. It establishes the design system with consistent colors, spacing, and typography. The CSS variables make it easy to maintain and update the design system.

### Component-Specific CSS Files

Each component has its own CSS file (e.g., `LoginPage.css`, `OwnerDashboard.css`) that contains:
- Component-specific styles
- Responsive design breakpoints
- Animation keyframes
- Theme-specific styles

**Explanation:**
Component-specific CSS files keep styles organized and scoped to their respective components. This modular approach makes the codebase maintainable and prevents style conflicts.

---

## Data Flow

### Authentication Flow

1. User fills login/registration form
2. Form handler calls `authService.login()` or `authService.register()`
3. `authService` calls `apiClient.post()` with credentials
4. `apiClient` attaches JWT token to request headers
5. Backend validates and returns JWT token + user data
6. `authService` stores token via `apiClient.setToken()`
7. User data stored in localStorage
8. User redirected to appropriate dashboard

### Data Fetching Flow

1. Dashboard component mounts
2. `useEffect` hook triggers data fetching
3. Component calls service method (e.g., `dashboardService.getOwnerDashboard()`)
4. Service calls `apiClient.get()` with endpoint
5. `apiClient` retrieves JWT token from localStorage
6. `apiClient` attaches token to Authorization header
7. Backend validates token and returns data
8. Component state updated with fetched data
9. UI re-renders with new data

### Error Handling Flow

1. API call fails (network error, server error, etc.)
2. `apiClient.request()` catches error
3. Error thrown with message from backend or generic message
4. Component's try-catch block catches error
5. Error state updated with error message
6. UI displays error message to user
7. Loading state cleared

---

## Best Practices Implemented

### 1. Component Organization
- Separation of concerns (components, pages, services)
- Reusable components with props
- Single responsibility principle

### 2. State Management
- Local state with useState hooks
- Effect hooks for side effects
- Proper dependency arrays in useEffect

### 3. API Integration
- Centralized API client
- Service layer for business logic
- Automatic token management
- Error handling at multiple levels

### 4. Code Reusability
- Generic API client for all HTTP requests
- Reusable UI components
- Service methods for common operations

### 5. User Experience
- Loading states during async operations
- Error messages for failed operations
- Success feedback for completed operations
- Responsive design for all screen sizes

### 6. Security
- JWT token storage in localStorage
- Automatic token attachment to requests
- Token clearing on logout
- Environment variables for sensitive data

---

## Performance Optimizations

1. **Lazy Loading:** Components can be lazy loaded for better initial load time
2. **Code Splitting:** Vite automatically splits code for optimal loading
3. **Memoization:** Can implement React.memo for expensive components
4. **Debouncing:** Can add debouncing for search inputs
5. **Pagination:** Can implement pagination for large data sets

---

## Future Enhancements

1. **TypeScript:** Add type safety with TypeScript
2. **State Management:** Implement Redux or Context API for global state
3. **Testing:** Add unit and integration tests
4. **PWA:** Convert to Progressive Web App
5. **Offline Support:** Add service worker for offline functionality
6. **Real-time Updates:** Implement WebSocket for real-time data
7. **Performance Monitoring:** Add performance monitoring tools
8. **Analytics:** Integrate analytics for user behavior tracking

---

## Conclusion

This frontend application is built with modern React best practices, providing a clean separation of concerns, reusable components, and a robust API integration layer. The service-based architecture makes it easy to maintain and extend, while the component-based UI provides a great user experience across all devices.

The code is organized logically with clear responsibilities for each file, making it easy for developers to understand and contribute to the project.
