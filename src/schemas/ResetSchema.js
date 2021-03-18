const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');


const ResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    timestamp: {
        type: Number,
        required: true
    },
    hash: {
        type: String,
        unique: true,
        required: true,
    },
    used: {
        type: Boolean,
        required: true,
        default: false
    }
})


ResetSchema.plugin(mongoosePaginate);


const Reset = mongoose.model('reset', ResetSchema);


module.exports = Reset;