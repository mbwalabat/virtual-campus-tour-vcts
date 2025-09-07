// MongoDB initialization script
db = db.getSiblingDB('campus_navigation');

// Create collections
db.createCollection('users');
db.createCollection('locations');
db.createCollection('departments');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.locations.createIndex({ "name": 1 }, { unique: true });
db.locations.createIndex({ "coordinates.latitude": 1, "coordinates.longitude": 1 });
db.locations.createIndex({ "name": "text", "description": "text", "department": "text" });
db.departments.createIndex({ "name": 1 }, { unique: true });

// Insert default super admin user
db.users.insertOne({
  name: "Super Administrator",
  email: "superadmin@sau.edu.pk",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIjS", // password123
  role: "superAdmin",
  department: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Insert sample departments
db.departments.insertMany([
  {
    name: "Computer Science",
    description: "Department of Computer Science and Information Technology",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Library",
    description: "University Central Library",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Administration",
    description: "University Administration Office",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("Database initialized successfully!");
print("Default super admin user created:");
print("Email: superadmin@sau.edu.pk");
print("Password: password123");
print("Please change the password after first login!");

