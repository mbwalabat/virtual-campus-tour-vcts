# Campus Navigation System - Integrated Full Stack Application

A comprehensive MERN (MongoDB, Express.js, React, Node.js) stack application for campus navigation with interactive maps, location details, user authentication, and administrative features.

## 🚀 Features

### Frontend Features
- **Interactive Campus Map**: Navigate through the campus with an intuitive map interface
- **Location Details**: Detailed information about campus locations with images and descriptions
- **360° Virtual Tours**: Immersive 360-degree views of campus locations
- **Audio Guides**: Audio descriptions for accessibility and enhanced user experience
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Role-based Access**: Different interfaces for students, admins, and super admins

### Backend Features
- **RESTful API**: Well-structured API endpoints for all functionality
- **User Management**: Complete user authentication and authorization system
- **Location Management**: CRUD operations for campus locations
- **Department Management**: Organize locations by departments
- **File Upload**: Support for images, audio files, and 360° view uploads
- **Security**: JWT authentication, rate limiting, and security headers
- **Database**: MongoDB integration with Mongoose ODM

## 📁 Project Structure

```
campus-navigation-integrated/
├── frontend/                 # React frontend source code
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts (Auth, etc.)
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   └── package.json        # Frontend dependencies
├── public/                  # Built frontend files (served by Express)
├── src/                     # Backend source code
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   └── utils/             # Utility functions
├── uploads/               # File upload directory
├── scripts/              # Utility scripts
├── server.js             # Main server file
└── package.json          # Backend dependencies
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local or cloud instance)

### Quick Setup
1. **Clone or extract the project**
   ```bash
   cd campus-navigation-integrated
   ```

2. **Install all dependencies and build the project**
   ```bash
   npm run setup
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the application**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:5000`

### Manual Setup
If you prefer to set up manually:

1. **Install backend dependencies**
   ```bash
   npm install
   ```

2. **Install frontend dependencies**
   ```bash
   npm run install-frontend
   ```

3. **Build the frontend**
   ```bash
   npm run build-frontend
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## 🔧 Development

### Backend Development
```bash
# Start backend in development mode with auto-reload
npm run dev
```

### Frontend Development
```bash
# Start frontend development server (runs on port 5173)
npm run dev-frontend
```

### Building Frontend
```bash
# Build frontend for production
npm run build-frontend
```

## 📝 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/campus-navigation

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 🗄️ Database Setup

### MongoDB Local Setup
1. Install MongoDB on your system
2. Start MongoDB service
3. The application will automatically create the database and collections

### MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update `MONGODB_URI` in your `.env` file

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Locations
- `GET /api/locations` - Get all locations
- `GET /api/locations/:id` - Get location by ID
- `POST /api/locations` - Create location (admin only)
- `PUT /api/locations/:id` - Update location (admin only)
- `DELETE /api/locations/:id` - Delete location (admin only)

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department (admin only)
- `PUT /api/departments/:id` - Update department (admin only)
- `DELETE /api/departments/:id` - Delete department (admin only)

## 🎯 User Roles

- **Student**: Can view locations and campus map
- **Admin**: Can manage locations and view analytics
- **Department Admin**: Can manage locations for their department
- **Super Admin**: Full system access including user management

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run API tests
npm run test:api
```

## 🚀 Deployment

### Using Docker
```bash
# Build and run with Docker
npm run docker:build
npm run docker:run

# Or use Docker Compose
npm run docker:up
```

### Manual Deployment
1. Set `NODE_ENV=production` in your environment
2. Build the frontend: `npm run build-frontend`
3. Start the server: `npm start`

## 📱 Frontend Routes

- `/` - Home page
- `/campus-map` - Interactive campus map
- `/location/:id` - Location details
- `/login` - User login
- `/profile` - User profile (protected)
- `/admin` - Admin dashboard (admin only)
- `/super-admin` - Super admin dashboard (super admin only)
- `/department-admin` - Department admin dashboard (dept admin only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🔄 Version History

- **v1.0.0** - Initial integrated release with full MERN stack functionality

---

**Built with ❤️ by the Campus Navigation Team**

