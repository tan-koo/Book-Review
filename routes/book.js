
var express = require('express');
const router = express.Router();
const books = require('../model/books');
const catalog = require('../model/catagorie')
const comments = require('../model/comment');
const middleware = require('../middleware');
const multer = require('multer');
const path = require('path');
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

const imagefilter = function (req, res, cb) {
  var ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.gif' && ext !== '.jpg' && ext !== '.jpeg') {
    return cb(new Error("Type File not include"), false)
  }
  cb(null, true);
}

const upload = multer({ storage: storage, filefilter: imagefilter });

// router.get("/", function (req, res) {
//   books.find({}, function (error, ALLData) {
//     if (error) {
//       console.log(error)
//     }
//     else {
//       catalog.find({}, function (err, Allcate) {
//         if (err) {
//           console.log(err)
//         }
//         else {
//           res.render("landing", { SongMa: ALLData, Songma3: Allcate });
//         }
//       })
//     }
//   })
// });

router.get('/', function (req, res, next) {
  books.paginate({}, { page: 1, limit: 3 }, function (err, ALLData) {
    if (err) {
      console.log(err);
    }
    else {
      catalog.find({}, function (err, Allcate) {
        if (err) {
          console.log(err)
        }
        else {
          // console.log(ALLData);
          // res.render("landing",{SongMa:ALLData,Songma3:Allcate});
          res.render('landing', {
            SongMa: ALLData.docs, Songma3: Allcate, total: ALLData.total, limit: ALLData.limit,
            page: ALLData.page,
            pages: ALLData.pages
          })
        }
      });
    }
  })
});

// page
router.get('/page/:page-:limit', function (req, res, next) {
  var page = req.params.page || 1;
  var r_limit = req.params.limit || 2;
  var limit = parseInt(r_limit);
  books.paginate({}, { page: page, limit: limit }, function (err, ALLData) {
    if (err) {
      console.log(err);
    }
    else {
      catalog.find({}, function (err, Allcate) {
        if (err) {
          console.log(err)
        }
        else {
          // res.render("landing",{SongMa:ALLData,Songma3:Allcate});
          res.render('landing', {
            SongMa: ALLData.docs, Songma3: Allcate, total: ALLData.total, limit: ALLData.limit,
            page: page,
            pages: ALLData.pages
          })
        }
      });
    }
  })
});

router.get("/search", function (req, res) {
  var noMatch = null;
  if (req.query.keyword) {
    const regex = new RegExp(escapeRegex(req.query.keyword), 'gi');
    // Get all posts from DB
    books.find({ name: regex }, function (err, allposts) {
      if (err) {
        console.log(err);
      }
      else {
        if (allposts.length < 1) {
          noMatch = "Can not find the post you are looking for";
        }
        res.render("search", { ItemSearch: allposts, noMatch: noMatch })
      }
    });
  }
  else {
    // Get all posts from DB
    post.find({}, function (err, allposts) {
      if (err) {
        console.log(err);
      } else {
        res.render("search", { ItemSearch: allposts, page: 'posts', noMatch: noMatch });
      }
    });
  }
});

router.get("/new", function (req, res) {
  res.render("addnewbook");
});

// new book
router.post("/", upload.single('imgurl'), function (req, res) {
  let n_name = req.body.name;
  let n_writer = req.body.writer;
  let n_imgurl = req.file.filename;
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
      res.redirect("/book");
    }
  })
});

router.get("/categorie/:text", function (req, res) {
  books.find({ category: req.params.text }, function (error, AllData2) {
    if (error) {
      console.log("error");
    }
    else {
      catalog.find({}, function (err, Allcate) {
        if (err) {
          console.log("error")
        }
        else {
          res.render("showcatagory", { SongMa2: AllData2, SongMa3: Allcate })
        }
      })
    }
  })
})

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

router.put("/:id", middleware.chechbookOwnership, upload.single('imgurl'), function (req, res) {
  let n_name = req.body.name;
  let n_writer = req.body.writer;
  let n_img = req.file.filename;
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