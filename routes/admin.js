
var express = require('express');
const router = express.Router();
const books = require('../model/books');
const catalog = require('../model/catagorie')
const User = require('../model/user');
const comments = require('../model/comment');
const middleware = require('../middleware');
const multer = require('multer');
const path = require('path');


router.post("/addlaew", function (req, res) {
    let n_tag = req.body.tag;
    let schema_post = { text: n_tag };
    catalog.create(schema_post, function (err, newdata) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/book");
        }
    })
});

module.exports = router;