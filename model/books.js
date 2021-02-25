
const mongoose = require('mongoose'),
    Comment = require('../model/comment'),
    User = require('../model/user');

passportLocalMongoose = require('passport-local-mongoose');
var mongoosePaginate = require('mongoose-paginate');

let bookSchema = new mongoose.Schema({
    name: String,
    writer: String,
    imgurl: String,
    desc: String,
    category: String,
    views: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
});

bookSchema.plugin(mongoosePaginate);
bookSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('books', bookSchema);
