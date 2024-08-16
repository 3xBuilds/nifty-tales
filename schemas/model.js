import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  // User schema definition...
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});

// Book Schema
const bookSchema = new mongoose.Schema({
  // Book schema definition...
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    unique: false,
    required: true
  },
});

// Check if models are already defined to prevent recompilation errors
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

export { User, Book };