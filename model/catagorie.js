
const mongoose = require('mongoose');

let categologSchema = new mongoose.Schema({
    text: String,
});

module.exports = mongoose.model('catalog', categologSchema);