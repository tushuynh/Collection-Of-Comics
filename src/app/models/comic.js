const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const reqStr = {
    type: String,
    required: true,
    default: '',
};

const comicSchema = new mongoose.Schema({
    userId: reqStr,
    name: reqStr,
    chapRead: reqStr,
    chapPresent: reqStr,
    type: reqStr,
    image: reqStr,
    lastRead: {
        type: Date,
        required: true,
        default: Date.now,
    },
    status: reqStr,
});

comicSchema.plugin(mongooseDelete, { 
    overrideMethods: 'all',
    deletedAt: true
});

module.exports = mongoose.model('Comic', comicSchema);