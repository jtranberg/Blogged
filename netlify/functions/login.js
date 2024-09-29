const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path to your User model

// Connect to MongoDB with the provided URI
const connectToMongoDB = async () => {
  const uri = "mongodb+srv://muhammadabubakarjamiu:hccSjarodDl5C2B4@cluster0.hkjjejk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  if (!uri) {
    throw new Error('MongoDB connection URI is missing.');
  }

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw new Error('Could not connect to the database');
    }
  }
};

exports.handler = async function (event, context) {
  try {
    // Log the incoming event for debugging
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Ensure the request body is not empty
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is missing' }),
      };
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON input' }),
      };
    }

    const { username, password } = parsedBody;

    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Username and password are required' }),
      };
    }

    // Connect to MongoDB
    await connectToMongoDB();

    const user = await User.findOne({ username });
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    // Generate a JWT token
    const token = jwt.sign({ sub: user._id }, 'your-hardcoded-jwt-secret', { expiresIn: '8h' });

    // Return token in JSON format
    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    // Ensure all errors are stringified and returned in valid JSON
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.toString() }),
    };
  }
};
