const books = require("../model/books");
const comment = require("../model/comment");

let middlewareObj = {};

middlewareObj.chechbookOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        books.findById(req.params.id,function(err,foundbook){
            if(err){
                res.redirect("back");
            }
            else{
                if(foundbook.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect('back');
                }
            }
        })
    }
    else{
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}

middlewareObj.loginyoung = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/login');
    }
}

module.exports = middlewareObj;
