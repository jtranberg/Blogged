const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: String,
  summary: String,
  content: String,
  cover: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

// Check if the model exists first to prevent "OverwriteModelError"
const PostModel = mongoose.models.Post || mongoose.model('Post', PostSchema);

module.exports = PostModel;
