
const mongoose = require('mongoose'),
    Comment = require('../model/comment'),
    User = require('../model/user');
// var mongoDB = 'mongodb://localhost:27017/LoginDB';
passportLocalMongoose = require('passport-local-mongoose');
var mongoosePaginate = require('mongoose-paginate');
// var ObjectId = require('mongodb').ObjectId;

// mongoose.connect(mongoDB,{
//     useNewUrlParser:true 
// })

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
bookSchema.plugin(passportLocalMongoose); /* อันนี้เพิ่มมาใหม่ */

/* var books = */ module.exports = mongoose.model('books', bookSchema);

// let books = mongoose.model("books",bookSchema);