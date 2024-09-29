import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Post from '../../models/Post'; // Adjust the path to your Post model
import User from '../../models/User'; // Import the User model

const connectToMongoDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
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

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized, token not provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Connect to the database
    await connectToMongoDB();

    if (req.method === 'GET') {
      // Fetch posts created by the logged-in user
      const userPosts = await Post.find({ author: decoded.sub }).populate('author', 'username').sort({ createdAt: -1 });

      return res.status(200).json({ posts: userPosts });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('TokenExpiredError:', error);
      return res.status(401).json({ error: 'Token expired, please log in again.' });
    } else {
      console.error('Error handling request:', error);
      return res.status(500).json({ error: 'Internal Server Error', details: error.toString() });
    }
  }
}
