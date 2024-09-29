import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Post from './models/Post'; // Adjust the path to your Post model
import User from './models/User'; // Import the User model

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
      // Retrieve posts and sort by creation date (newest first)
      const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
      return res.status(200).json({ posts });
    }

    if (req.method === 'POST') {
      let body;
      try {
        body = JSON.parse(req.body); // Parse body as JSON
      } catch (error) {
        return res.status(400).json({ error: 'Invalid JSON input' });
      }

      const { title, content, image } = body;

      // Check if the required fields are provided
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      // Find the user (author) based on the token
      const user = await User.findById(decoded.sub);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create a new post
      const newPost = new Post({
        title,
        content,
        image,
        author: user._id, // Set the author to the current user
      });

      await newPost.save();

      return res.status(201).json({ message: 'Post created successfully', post: newPost });
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
