
const express = require('express'),
    router = express.Router({ mergeParams: true }),
    Comment = require('../model/comment'),
    book = require('../model/books');
const middleware = require('../middleware');

router.get("/", function (req, res) {
    book.findById(req.params.id, function (error, books) {
        if (error) { console.log("Error!"); }
        else {
            console.log(book);
            res.render("comment/new", { book: books });
        }
    })
});

router.post('/', function (req, res) {
    console.log("post comment" + req.params.id);
    book.findById(req.params.id, function (error, books) {
        if (error) { console.log("error") }
        else {
            Comment.create({ text: req.body.text, userment: req.user._id }, function (err, result) {
                console.log(result);
                if (err) { console.log("error tong 3"); }
                else {
                    books.comments.push(result._id);
                    books.save();
                    res.redirect('/book/' + books._id);
                }
            })
        }
    })
})

// edit & update
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundcomment) {
        if (err) { res.redirect("back"); }
        else { res.render("comment/edit", { book_id: req.params.id, comment: foundcomment }) }
    })
})

router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    let n_ment = req.body.editment;
    var n_card2 = { text: n_ment }
    console.log(n_ment);
    Comment.findByIdAndUpdate(req.params.comment_id, n_card2, function (err, updatebookment) {
        if (err) { res.redirect("back"); }
        else { res.redirect('/book/' + req.params.id); }
    })
})

// delete
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) { res.redirect("back"); }
        else { res.redirect('/book/' + req.params.id); }
    })
})

module.exports = router;