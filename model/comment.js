
const mongoose = require('mongoose');

// books = require('../model/books');
// var mongoDB = 'mongodb://localhost:27017/LoginDB';
// passportLocalMongoose = require('passport-local-mongoose');/*อันนี้เพิ่มมาใหม่นะ*/ 

let commentSchema = new mongoose.Schema({
        text: String,
        userment: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
        }
});

module.exports = mongoose.model('Comment', commentSchema);

// tarotSchema.plugin(passportLocalMongoose);

/* bookSchema.plugin(passportLocalMongoose); อันนี้เพิ่มมาใหม่นะ */

// let comment = mongoose.model("Comment",commentSchema);

// Comment.create(
//         {
//                 text: "Berlcok",
//                 userment: "Toome"
//         }, function (error, comment) {
//                 if (error) { console.log("Error"); }
//                 else {
//                         books.comments.push(comment);
//                         books.save();
//                         console.log("Added");
//                 }
//         });