var express = require("express"),
    router  = express.Router(),
    Campground    = require("../models/campground"),
    middleware   = require('../middleware');

router.get("/",function(req,res){
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render('campgrounds/index',{campgrounds:allcampgrounds});
        }
    })
});
router.post("/",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var state=req.body.state;
    var image=req.body.image;
    var desc=req.body.description;
    var price=req.body.price;
    var object={
        name:name,
        state,
        image:image,
        description:desc,
        price
    }
    Campground.create(object,function(err,campground){
        if(err){
            console.log(err);
        }else{
            campground.author.id = req.user._id;
            campground.author.username = req.user.username;
            campground.save();
            res.redirect("/campgrounds");
        }
    });
});
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render('campgrounds/new');
});
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
            if(err){
                console.log(err);
            }
            else{
                res.render('campgrounds/show',{campground:foundcampground})
            }
        });
    });
router.get('/:id/edit', middleware.checkOwnership,(req,res) => {
  Campground.findById(req.params.id, (err,campground) => {
      if(err){
        // req.flash('error','Campground not found!');
      }
      res.render('campgrounds/edit',{campground});
    });
});
router.put('/:id',middleware.checkOwnership, (req,res) => {
  var name=req.body.name;
  var state=req.body.state;
  var image=req.body.image;
  var description=req.body.description;
  var price=req.body.price;
  var object={
      name,
      state,
      image,
      description,
      price
  }
  Campground.findByIdAndUpdate(req.params.id,object,(err,campground) => {
    if(err){
      console.log(err);
      res.redirect('/campgrounds');
    }else{
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
})
router.delete('/:id',middleware.checkOwnership, (req,res) => {
    Campground.findByIdAndRemove(req.params.id,(err) => {
      if(err){
        res.redirect('/campgrounds');
      }else{
        res.redirect('/campgrounds')
      }
    })
})

module.exports = router;
