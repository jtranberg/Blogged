const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Post = require('./models/Post'); // Adjust the path to your Post model

// Connect to MongoDB
const connectToMongoDB = async () => {
  const uri = "mongodb+srv://muhammadabubakarjamiu:hccSjarodDl5C2B4@cluster0.hkjjejk.mongodb.net/?retryWrites=true&w=majority";

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw new Error('Could not connect to the database');
    }
  }
};

exports.handler = async function(event, context) {
  try {
    // Ensure method is GET
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    // Ensure Authorization header exists
    const token = event.headers.authorization?.split(' ')[1]; // Extract token from 'Bearer <token>'
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized, token not provided' }),
      };
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, 'your-hardcoded-jwt-secret'); // Replace with your actual JWT secret
    } catch (error) {
      console.error('Token verification error:', error);
      if (error.name === 'TokenExpiredError') {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Token expired, please log in again.' }),
        };
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Invalid token' }),
        };
      }
    }

    // Connect to MongoDB
    await connectToMongoDB();

    // Fetch posts created by the logged-in user
    const userPosts = await Post.find({ author: decoded.sub }).populate('author', 'username').sort({ createdAt: -1 });

    return {
      statusCode: 200,
      body: JSON.stringify({ posts: userPosts }),
    };
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.toString() }),
    };
  }
};
