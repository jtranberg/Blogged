const mongoose = require('mongoose');
const Post = require('./models/Post'); // Adjust the path to your Post model

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

exports.handler = async function (event, context) {
  try {
    // Ensure the request body is not empty
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is missing' }),
      };
    }

    // Try to parse the JSON body
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON input' }),
      };
    }

    const { title, content, image } = parsedBody;

    // Validate required fields
    if (!title || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Title and content are required' }),
      };
    }

    // Connect to MongoDB
    await connectToMongoDB();

    // Create a new post
    const newPost = new Post({
      title,
      content,
      image,
    });
    await newPost.save();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Post created successfully', post: newPost }),
    };
  } catch (error) {
    console.error('Error creating post:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.toString() }),
    };
  }
};
