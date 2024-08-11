import mongoose, {Schema, model, models, trusted} from 'mongoose';
import Book from "./bookSchema"

const UserSchema = new Schema({

    wallet: {
        type: String,
        default: "",
        unique: false
    },
    email:{
        type:String,
        unique: true,
        required: true
    },
    profileImage: {
        type: String,
        default: "",
        unique: false
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    readlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Book,
    }],
    yourBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Book,
    }],
    contractAdd: {
        type: String,
        default:"",
        unique: false
    },
    role: {
        type: String,
        default: "USER",
        unique: false
    },
  }, {collection: "users"})

  const User = models.User || model('User', UserSchema);

  export default User