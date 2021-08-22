const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authorSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    // authorId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Author',
    //   required: true
    // }
  });
  
  module.exports = mongoose.model('Author', authorSchema);