import mongoose, {Schema, model, models, trusted} from 'mongoose';

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
    username: {
        type: String,
        required: true,
        unique: true
    }, 
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