
var express = require('express');
const router = express.Router();
const books = require('../model/books');
const catalog = require('../model/catagorie')
// var user  = require('../model/user');
const comments = require('../model/comment');
const middleware = require('../middleware');

router.get("/", function (req, res) {
  books.find({}, function (error, ALLData) {
    if (error) {
      console.log(error)
    }
    else {
      res.render("landing", { SongMa: ALLData })
    }
  })
});

router.get("/search", async function (req, res) {
  let key = req.query.keyword;
  const result = await books.find({ name: { $regex: key } });
  console.log(result);
  res.render("search", { ItemSearch: result, key: key });
});

router.get("/niyay", function (req, res) {
  books.find({ category: "Novel" }, function (error, ALLData2) {
    if (error) {
      console.log(error)
    }
    else {
      res.render("showcatagory", { SongMa2: ALLData2 })
    }
  })
})

router.get("/warasan", function (req, res) {
  books.find({ category: "Magazine" }, function (error, ALLData2) {
    if (error) {
      console.log(error)
    }
    else {
      res.render("showcatagory", { SongMa2: ALLData2 })
    }
  })
})

router.get("/cartoon", function (req, res) {
  books.find({ category: "Cartoon" }, function (error, ALLData2) {
    if (error) {
      console.log(error)
    }
    else {
      res.render("showcatagory", { SongMa2: ALLData2 })
    }
  })
})

router.get("/home", function (req, res) {
  books.find({ category: "House" }, function (error, ALLData2) {
    if (error) {
      console.log(error)
    }
    else {
      res.render("showcatagory", { SongMa2: ALLData2 })
    }
  })
})

router.get("/new", function (req, res) {
  res.render("addnewbook");
});

// new book
router.post("/", function (req, res) {
  let n_name = req.body.name;
  let n_writer = req.body.writer;
  let n_imgurl = req.body.imgurl;
  let n_desc = req.body.desc;
  let n_tag = req.body.tag;
  let n_author = {
    id: req.user.id,
    username: req.user.username
  };
  // let n_comment = req.body.comments;
  // let n_authurid = req.body.authurID;
  // let n_nameuser = req.body.nameuser;
  let schema_post = { name: n_name, writer: n_writer, imgurl: n_imgurl, desc: n_desc, author: n_author, category: n_tag };
  books.create(schema_post, function (err, newdata) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(newdata);
      // comments.create(
      //   {
      //     text: "I am",
      //     userment:"ToB"
      //   },function(err, comments){
      //     if(err){
      //       console.log("error FUnction Comment")
      //     }
      //     else{
      //       books.comments.push(comments);
      //       books.save();
      //       console.log("comment added");
      //     }
      //   }
      // )
      res.redirect("/book");
    }
  })
});

// detail
router.get("/:id", middleware.loginyoung, function (req, res) {
  books.findById(req.params.id).populate({
    path: 'comments', model: 'Comment', populate: ({
      path: 'userment', model: 'User'
    })
  }).exec(function (error, idbook) {
    if (error) {
      console.log(error)
    }
    else {
      // console.log(idbook);
      res.render("showdetail", { detail: idbook });
    }
  });
});

// edit & update
router.get("/:id/edit", middleware.chechbookOwnership, function (req, res) {
  books.findById(req.params.id, function (err, foundbook) {
    res.render("edit", { book: foundbook })
  })
})

router.put("/:id", middleware.chechbookOwnership, function (req, res) {
  let n_name = req.body.name;
  let n_writer = req.body.writer;
  let n_img = req.body.imgurl;
  let n_desc = req.body.desc;
  let n_tag = req.body.tag;
  var n_card = { name: n_name, writer: n_writer, imgurl: n_img, desc: n_desc, category: n_tag };
  books.findByIdAndUpdate(req.params.id, n_card, function (err, updatebook) {
    if (err) {
      console.log("test 2");
      res.redirect("/book");
    }
    else {
      // console.log(req.body.books)
      // console.log('test1')
      res.redirect('/book/' + req.params.id);
    }
  })
})

// delete
router.delete("/:id", middleware.chechbookOwnership, function (req, res) {
  books.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect('/book');
    }
    else {
      res.redirect('/book');
    }
  })
})


module.exports = router;