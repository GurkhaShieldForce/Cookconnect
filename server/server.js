//server>server.js
const path = require('path');
console.log('Current directory:', process.cwd());
console.log('Attempting to load .env from:', path.resolve(process.cwd(), '.env'));

require('dotenv').config();

// Log all environment variables (be careful with this in production)
console.log('All environment variables:', process.env);

const express = require('express');
const mongoose = require('mongoose');
const { config } = require('./config/config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Menu = require('./models/Menu');
const User = require('./models/User');

// Initialize express
const app = express();

// IMPORTANT: Move these middleware declarations BEFORE any routes
// Middleware setup - must be before routes
app.use(express.json());  // This must come first to parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // For parsing URL-encoded bodies
app.use(cors({ 
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(cors(corsOptions));


// Add debug middleware to see incoming requests and bodies
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.path}`);
  console.log('📦 Request Body:', req.body);
  next();
});

// Enhanced MongoDB connection function
const connectDB = async () => {
  try {
    console.log('\n🔄 Attempting to connect to MongoDB...\n');
    const startTime = Date.now();

    await mongoose.connect(process.env.MONGODB_URI, {
      serverApi: {
        version: '1',
        strict: false,
        deprecationErrors: true,
      }
    });

    const db = mongoose.connection.db;
    const connectionTime = Date.now() - startTime;
    
    console.log('✅ MongoDB connection successful!');
    console.log('⏱️  Connection established in:', connectionTime, 'ms');
    console.log('\n📊 Database Information:');
    console.log('- Database Name:', db.databaseName);
    console.log('- Connection Host:', mongoose.connection.host);

    // Test database operations
    const collections = await db.listCollections().toArray();
    console.log('📚 Available collections:', collections.map(c => c.name));

    return true;
  } catch (error) {
    console.error('\n❌ MongoDB Connection Error:', error);
    console.error('\nError Details:');
    console.error('- Name:', error.name);
    console.error('- Message:', error.message);
    if (error.code) console.error('- Code:', error.code);
    return false;
  }
};

// MongoDB connection event listeners
mongoose.connection.on('connecting', () => {
  console.log('⏳ Connecting to MongoDB...');
});

mongoose.connection.on('disconnecting', () => {
  console.log('⏳ Disconnecting from MongoDB...');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 MongoDB Error:', err);
});

// Modified server startup function
const startServer = async () => {
  try {
    // Check for required environment variables
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      console.error('Please check your .env file configuration');
      process.exit(1);
    }

    const isConnected = await connectDB();
    if (!isConnected) {
      console.error('Failed to connect to MongoDB Atlas. Exiting...');
      process.exit(1);
    }

    // Middleware setup
    app.use(cors({ 
      origin: ['http://localhost:5173'],
      credentials: true 
    }));
    app.use(express.json());

    // Start the server
    app.listen(3001, () => {
      console.log('🚀 Server is running on port 3001');
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

// Auth Routes
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, userType, profile } = req.body;
    
    // Log incoming request data (exclude password for security)
    console.log('Signup request:', { 
      email, 
      userType, 
      profile,
      hasPassword: !!password 
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      email,
      password: hashedPassword,
      userType,
      profile
    });
    
    await user.save();
    console.log('User saved successfully:', user._id);
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({ user: userResponse, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Facebook Auth server/routes/auth.js or server.js
app.post('/api/auth/facebook/callback', async (req, res) => {
  try {
      const { code } = req.body;

      // Exchange the code for an access token
      const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          query: {
              client_id: process.env.FACEBOOK_APP_ID,
              client_secret: process.env.FACEBOOK_APP_SECRET,
              code: code,
              redirect_uri: process.env.FACEBOOK_REDIRECT_URI
          }
      });

      const { access_token } = await tokenResponse.json();

      // Get user profile information
      const profileResponse = await fetch('https://graph.facebook.com/me', {
          headers: {
              Authorization: `Bearer ${access_token}`
          },
          query: {
              fields: 'id,email,first_name,last_name'
          }
      });

      const profile = await profileResponse.json();

      // Find or create user
      let user = await User.findOne({ facebookId: profile.id });

      if (!user) {
          user = new User({
              email: profile.email,
              profile: {
                  firstName: profile.first_name,
                  lastName: profile.last_name
              },
              facebookId: profile.id,
              userType: 'customer' // default type
          });
          await user.save();
      }

      // Generate JWT token
      const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
      );

      res.json({ token, user });
  } catch (error) {
      console.error('Facebook callback error:', error);
      res.status(500).json({ error: 'Authentication failed' });
  }
});

//GET routes for chef and customer dashboards
app.get('/api/user/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Format the response based on user type
    if (user.userType === 'chef') {
      return res.json({
        id: user._id,
        email: user.email,
        orders: [], // Chef-specific data (e.g., managed orders)
        message: `Welcome, Chef ${user.profile.fullName || ''}`,
        userType: user.userType,
        fullName: `${user.profile.firstName} ${user.profile.lastName}`,
        profile: user.profile,
        // Add any other chef-specific data you need
      });
    } else if (user.userType === 'customer') {
      return res.json({
        message: `Welcome, ${user.profile.fullName || 'Customer'}`,
        email: user.email,
        location: user.profile.location || 'Not specified',
        isProfileComplete: !!user.profile.fullName,
      });
    }

    res.status(400).json({ error: 'Invalid user type' });
  } catch (error) {
    console.error('Profile fetch error:', error);
    // Add more detailed error logging
    if (error.name === 'JsonWebTokenError') {
      console.error('JWT Error details:', error.message);
    }
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/chefs', async (req, res) => {
  try {
    const chefs = await User.find({ userType: 'chef' })
      .select('-password')
      .lean();

    const formattedChefs = chefs.map(chef => ({
      id: chef._id,
      name: `${chef.profile.firstName} ${chef.profile.lastName}`,
      cuisine: chef.profile.specialties, // This is coming as a string, not an array
      profile: {
        firstName: chef.profile.firstName,
        lastName: chef.profile.lastName,
        bio: chef.profile.bio || '',
        specialties: chef.profile.specialties?.split(',') || [],
        location: chef.profile.location || 'Location not specified',
        yearsOfExperience: chef.profile.yearsOfExperience || 0,
        certifications: chef.profile.certifications || []
      },
      cuisine: Array.isArray(chef.profile.specialties) 
        ? chef.profile.specialties 
        : chef.profile.specialties?.split(',') || [],
      rating: chef.rating || 0,
      reviews: chef.reviews || 0,
      imageUrl: chef.profile.imageUrl,
      pricing: {
        baseRate: chef.profile.baseRate || 0,
        minimumGuests: chef.profile.minimumGuests || 1
      },
      availability: {
        weekdays: chef.profile.availability?.weekdays || false,
        weekends: chef.profile.availability?.weekends || false,
        evenings: chef.profile.availability?.evenings || false
      }
    }));

    res.json(formattedChefs);
  } catch (error) {
    console.error('Error fetching chefs:', error);
    res.status(500).json({ error: 'Failed to fetch chefs' });
  }
});
// Modify your existing /api/chefs endpoint in server.js
app.get('/api/chefs/:id?', async (req, res) => {
  try {
    // If an ID is provided, return single chef
    if (req.params.id) {
      const chef = await User.findOne({ 
        _id: req.params.id,
        userType: 'chef'
      }).select('-password').lean();

      if (!chef) {
        return res.status(404).json({ error: 'Chef not found' });
      }

      // Use the same formatting logic you already have
      const formattedChef = {
        id: chef._id,
        name: `${chef.profile.firstName} ${chef.profile.lastName}`,
        cuisine: chef.profile.specialties,
        profile: {
          firstName: chef.profile.firstName,
          lastName: chef.profile.lastName,
          bio: chef.profile.bio || '',
          specialties: chef.profile.specialties?.split(',') || [],
          location: chef.profile.location || 'Location not specified',
          yearsOfExperience: chef.profile.yearsOfExperience || 0,
          certifications: chef.profile.certifications || []
        },
        cuisine: Array.isArray(chef.profile.specialties) 
          ? chef.profile.specialties 
          : chef.profile.specialties?.split(',') || [],
        rating: chef.rating || 0,
        reviews: chef.reviews || 0,
        imageUrl: chef.profile.imageUrl,
        pricing: {
          baseRate: chef.profile.baseRate || 0,
          minimumGuests: chef.profile.minimumGuests || 1
        },
        availability: {
          weekdays: chef.profile.availability?.weekdays || false,
          weekends: chef.profile.availability?.weekends || false,
          evenings: chef.profile.availability?.evenings || false
        }
      };

      return res.json(formattedChef);
    }

    // Otherwise, return all chefs (your existing code)
    const chefs = await User.find({ userType: 'chef' })
      .select('-password')
      .lean();

    const formattedChefs = chefs.map(chef => ({
      // Your existing chef formatting code
    }));

    res.json(formattedChefs);
  } catch (error) {
    console.error('Error fetching chef(s):', error);
    res.status(500).json({ error: 'Failed to fetch chef data' });
  }
});

app.put('/api/user/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user profile
    user.email = req.body.email;
    user.profile = {
      ...user.profile,
      ...req.body.profile
    };

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: error.message });
  }
});
// Add to server.js
app.post('/api/user/profile/setup', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update profile
    user.profile = {
      ...user.profile,
      ...req.body.profile
    };

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error('Profile setup error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Data Deletion Request
app.delete('/api/user/data-deletion', async (req, res) => {
  try {
    const { signed_request } = req.body;
    
    // Verify the request is from Facebook
    if (!signed_request) {
      return res.status(400).json({ error: 'Missing signed request' });
    }

    // Parse and verify Facebook's signed request
    // Store deletion request in database
    await User.updateOne(
      { facebookId: userId },
      { $set: { 
        deletionRequested: true,
        deletionRequestedAt: new Date()
      }}
    );

    // Respond to Facebook
    res.json({
      url: `${process.env.BASE_URL}/user-data-deletion`,
      confirmation_code: generatedConfirmationCode
    });
  } catch (error) {
    console.error('Data deletion request error:', error);
    res.status(500).json({ error: 'Failed to process deletion request' });
  }
});
//Menu Routes
app.post('/api/menus', async (req, res) => {
  try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const menu = new Menu({
          ...req.body,
          chefId: decoded.userId,
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date()
      });

      await menu.save();
      res.status(201).json(menu);
  } catch (error) {
      console.error('Error creating menu:', error);
      res.status(500).json({ error: 'Failed to create menu' });
  }
});

// GET endpoint to fetch menus
app.get('/api/menus', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find all menus for the authenticated chef
        const menus = await Menu.find({ chefId: decoded.userId });
        res.json(menus);
    } catch (error) {
        console.error('Error fetching menus:', error);
        res.status(500).json({ error: 'Failed to fetch menus' });
    }
});

// GET endpoint to fetch menus by chef ID
app.get('/api/menus/chef/:chefId', async (req, res) => {
    try {
        const { chefId } = req.params;
        const menus = await Menu.find({ chefId });
        res.json(menus);
    } catch (error) {
        console.error('Error fetching chef menus:', error);
        res.status(500).json({ error: 'Failed to fetch menus' });
    }
});

// Add this near your other routes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Remove the old app.listen and call startServer instead
startServer();