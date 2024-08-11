import mongoose, {Schema, model, models, trusted} from 'mongoose';

const BookSchema = new Schema({

    bookName: {
        type: String,
        default: "",
        unique: false,
        required: true
    },
    author: {
        type: String,
        default:"",
        unique: false
    },
    ISBN:{
        type:String,
        unique: true,
    },
    description: {
        type: String,
        default: "",
        unique: false
    },
    tags: {
        type: [String],
        default: [""]
    }, 
    pdf:{
        type: String,
        required: true
    },
    publishTime:{
        type: Date,
        default: Date.now
    }
    
  }, {collection: "books"})

  const Book = models.Book || model('Book', BookSchema);

  export default Book