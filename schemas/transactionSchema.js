import mongoose, {Schema, model, models, trusted} from 'mongoose';
import User from './userSchema';
import Book from './bookSchema';

const TransactionSchema = new Schema({

    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Book,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    txnHash:{
        type: String,
        required: true
    }

  }, {collection: "transactions"})

  const Transactions = models.Transactions || model('Transactions', TransactionSchema);

  export default Transactions