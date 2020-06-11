const express = require('express'),
    router = express.Router({mergeParams: true}),
    Comment = require('../model/comment'),
    book = require('../model/books');
//       middleware = require('../middleware');



router.get("/",function(req,res){
    // console.log(req.params.id);
    book.findById(req.params.id,function(error, books){
        if(error){
            console.log("Error!");
        } else {
            console.log(book);
            res.render("comment/new",{book:books});
        }
    })
});

router.post('/',function(req,res){
    console.log("post comment"+req.params.id);
    book.findById(req.params.id,function(error, books){
        if(error){
            console.log("error tong 2")/*2 */
        }
        else
        {

            Comment.create({text: req.body.text , userment: req.user._id},function(err,result)
            {
                console.log(result);
                if(err){
                    console.log("error tong 3");/* 3 */
                }
                else{
                    books.comments.push(result._id);
                    books.save();
                    // comments.push(comment);
                    // comments.save();
                    res.redirect('/book/' + books._id);
                }
            })
        }
    })
})
//error ตรงนี้นะ
router.get("/:comment_id/edit",function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundcomment){
        if(err){
            res.redirect("back");
        }
        else{
            res.render("comment/edit",{book_id:req.params.id, comment:foundcomment})

        }
    })
  })
  
  
  router.put("/:comment_id",function(req,res){
    let n_name = req.body.name;
    let n_img  = req.body.imgurl;
    let n_desc = req.body.desc;
    let n_tag  = req.body.categories;
    var n_card = {name:n_name,imgurl:n_img,desc:n_desc,category:n_tag};
    books.findByIdAndUpdate(req.params.id, n_card ,function(err,updatebook){
      if(err){
        console.log("test 2");
        res.redirect("/book");
      }
      else{
        // console.log(req.body.books)
        // console.log('test1')
        res.redirect('/book/' + req.params.id);
      }
    })
  })

// router.post("/",function(req,res){
//     let n_name = req.body.name;
//     let n_image = req.body.image;
//     let n_desc = req.body.desc;
//     let n_card = {name:n_name,image:n_image,desc:n_desc};
//     Tarot.create(n_card, function(error,newCard){
//         if(error){
//             console.log("error"); 
//         } else {
//             console.log("New card added.");
//             res.redirect("/tarot");
//         }
//     });
// });

// router.get("/new",function(req,res){
//     res.render("tarots/new");
// });

// router.get("/:id",function(req,res){
//     Tarot.findById(req.params.id).populate('comments').exec(function(error, idCard){
//         if(error){
//             console.log("Error");
//         } els   e {
//             res.render("tarots/show",{tarot:idCard});
//         }
//     });
// });


module.exports = router;