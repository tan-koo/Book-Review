
const mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
        text: String,
        userment: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
        }
});

module.exports = mongoose.model('Comment', commentSchema);
