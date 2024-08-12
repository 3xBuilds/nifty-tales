import { ObjectId } from 'mongodb';
import mongoose, {Schema, model, models, trusted} from 'mongoose';

const BookSchema = new Schema({

    name: {
        type: String,
        default: null,
        unique: false,
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false,
        unique: false
    },
    price: {
        type: Number,
        default: 0,
        unique: false
    },
    maxMint: {
        type: Number,
        default: 1,
        unique: false
    },
    cover: {
        type: String,
        default: null,
        unique: false
    },
    author: {
        type: ObjectId,
        default: null,
        unique: false,
        required: true
    },
    artist: {
        type: String,
        default: null,
        unique: false
    },
    ISBN:{
        type:String,
        // unique: true,
        default: null,
        required: false
    },
    description: {
        type: String,
        default: null,
        unique: false
    },
    tags: {
        type: [String],
        default: []
    }, 
    pdf:{
        type: String,
        default: null,
        required: true
    },
    readers: {
        type: Number,
        default: 0
    },
    isBoosted:{
        type: String,
        default: null
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
    
  }, {collection: "books"})

  const Book = models.Book || model('Book', BookSchema);

  export default Book