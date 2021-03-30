const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const diseaseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description:
        {
        type: String,
        required: true
    },
    causes:
      {
        type:Array,
        required: true
    },
    link:
        {
        type: String,
        required: false
    }
});

const Disease = mongoose.model('Disease', diseaseSchema);
module.exports = Disease;