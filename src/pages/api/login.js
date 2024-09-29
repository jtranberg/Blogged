import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';;
import mongoose from 'mongoose';
import User from '../../models/User'; // Adjust the path to your model

const connectToMongoDB = async () => {
  // Hardcoded URI for debugging purposes
  const uri = "mongodb+srv://muhammadabubakarjamiu:hccSjarodDl5C2B4@cluster0.hkjjejk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  console.log('MONGO_URI:', uri); // Log the MongoDB URI

  if (!uri) {
    console.error('MongoDB connection URI is undefined');
    throw new Error('MongoDB connection URI is missing');
  }

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { username, password } = req.body;

    // Debug: check if the username and password are received correctly
    console.log('Received credentials:', { username, password });

    // Connect to MongoDB
    await connectToMongoDB();

    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the input password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    console.log('Generated token:', token);

    // Send the token as a response
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.toString() });
  }
}
