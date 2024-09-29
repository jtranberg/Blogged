const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path to your User model

const connectToMongoDB = async () => {
  const uri = "mongodb+srv://muhammadabubakarjamiu:hccSjarodDl5C2B4@cluster0.hkjjejk.mongodb.net/?retryWrites=true&w=majority";
  
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

exports.handler = async function(event, context) {
  try {
    // Ensure request method is POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    // Ensure request body is present
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is missing' }),
      };
    }

    // Parse the request body
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON input' }),
      };
    }

    const { username, email, password } = parsedBody;

    // Validate input fields
    if (!username || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required (username, email, password).' }),
      };
    }

    // Connect to MongoDB
    await connectToMongoDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User with this email already exists.' }),
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User registered successfully' }),
    };
  } catch (error) {
    console.error('Error during registration:', error);

    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error registering user', details: error.toString() }),
    };
  }
};
