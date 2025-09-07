const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../src/models/User');
const Department = require('../src/models/Department');
const Location = require('../src/models/Location');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_navigation');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleDepartments = [
  {
    name: 'Computer Science',
    description: 'Department of Computer Science and Information Technology'
  },
  {
    name: 'Library',
    description: 'University Central Library'
  },
  {
    name: 'Administration',
    description: 'University Administration Office'
  },
  {
    name: 'Engineering',
    description: 'Faculty of Engineering'
  },
  {
    name: 'Business',
    description: 'School of Business Administration'
  }
];

const sampleUsers = [
  {
    name: 'Super Administrator',
    email: 'superadmin@sau.edu.pk',
    password: 'password123',
    role: 'superAdmin'
  },
  {
    name: 'CS Department Admin',
    email: 'cs.admin@sau.edu.pk',
    password: 'password123',
    role: 'departmentAdmin',
    department: 'Computer Science',
    faculty: 'Faculty of Engineering'
  },
  {
    name: 'Library Admin',
    email: 'library.admin@sau.edu.pk',
    password: 'password123',
    role: 'departmentAdmin',
    department: 'Library',
    faculty: 'Faculty of Arts'
  },
  {
    name: 'John Doe',
    email: 'john.doe@sau.edu.pk',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@sau.edu.pk',
    password: 'password123',
    role: 'user'
  }
];

const sampleLocations = [
  {
    name: 'Computer Science Building',
    description: 'Main building for Computer Science department with labs, classrooms, and faculty offices.',
    department: 'Computer Science',
    coordinates: {
      latitude: 31.5204,
      longitude: 74.3587
    }
  },
  {
    name: 'Central Library',
    description: 'University central library with extensive collection of books, journals, and digital resources.',
    department: 'Library',
    coordinates: {
      latitude: 31.5214,
      longitude: 74.3597
    }
  },
  {
    name: 'Administration Block',
    description: 'Main administration building housing registrar office, finance department, and other administrative services.',
    department: 'Administration',
    coordinates: {
      latitude: 31.5194,
      longitude: 74.3577
    }
  },
  {
    name: 'Engineering Complex',
    description: 'Engineering faculty building with mechanical, electrical, and civil engineering departments.',
    department: 'Engineering',
    coordinates: {
      latitude: 31.5224,
      longitude: 74.3607
    }
  },
  {
    name: 'Business School',
    description: 'School of Business Administration with MBA and undergraduate business programs.',
    department: 'Business',
    coordinates: {
      latitude: 31.5184,
      longitude: 74.3567
    }
  },
  {
    name: 'CS Lab 1',
    description: 'Computer programming lab with 40 workstations for programming courses.',
    department: 'Computer Science',
    coordinates: {
      latitude: 31.5206,
      longitude: 74.3589
    }
  },
  {
    name: 'CS Lab 2',
    description: 'Advanced computing lab with high-performance workstations for research projects.',
    department: 'Computer Science',
    coordinates: {
      latitude: 31.5208,
      longitude: 74.3591
    }
  },
  {
    name: 'Library Reading Hall',
    description: 'Quiet study area with 200 seats for individual and group study.',
    department: 'Library',
    coordinates: {
      latitude: 31.5216,
      longitude: 74.3599
    }
  }
];

// Seed function
const seedData = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Department.deleteMany({});
    await Location.deleteMany({});

    // Create departments
    console.log('🏢 Creating departments...');
    const departments = await Department.insertMany(sampleDepartments);
    console.log(`✅ Created ${departments.length} departments`);

    // Create users
    console.log('👥 Creating users...');
    const users = [];
    for (const userData of sampleUsers) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      users.push(await user.save());
    }
    console.log(`✅ Created ${users.length} users`);

    // Create locations
    console.log('📍 Creating locations...');
    const locations = [];
    for (const locationData of sampleLocations) {
      // Find a user to assign as creator (preferably admin)
      const creator = users.find(u => u.role === 'superAdmin') || users[0];
      
      const location = new Location({
        ...locationData,
        createdBy: creator._id
      });
      
      locations.push(await location.save());
    }
    console.log(`✅ Created ${locations.length} locations`);

    // Update departments with location references
    console.log('🔗 Updating department-location relationships...');
    for (const dept of departments) {
      const deptLocations = locations.filter(loc => loc.department === dept.name);
      dept.locations = deptLocations.map(loc => loc._id);
      await dept.save();
    }

    console.log('🎉 Data seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Departments: ${departments.length}`);
    console.log(`   Users: ${users.length}`);
    console.log(`   Locations: ${locations.length}`);
    
    console.log('\n🔐 Default Login Credentials:');
    console.log('   Super Admin:');
    console.log('     Email: superadmin@sau.edu.pk');
    console.log('     Password: password123');
    console.log('   CS Admin:');
    console.log('     Email: cs.admin@sau.edu.pk');
    console.log('     Password: password123');
    console.log('   Library Admin:');
    console.log('     Email: library.admin@sau.edu.pk');
    console.log('     Password: password123');
    console.log('   Regular User:');
    console.log('     Email: john.doe@sau.edu.pk');
    console.log('     Password: password123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
  }
};

// Run seeding if called directly
if (require.main === module) {
  connectDB().then(seedData);
}

module.exports = { seedData, connectDB };

