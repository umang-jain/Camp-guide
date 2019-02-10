var express = require("express"),
    router  = express.Router(),
    Campground    = require("../models/campground");

router.get("/",function(req,res){
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{campgrounds:allcampgrounds});
        }
    })
});
router.post("/",isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    var object={
        name:name,
        image:image,
        description:desc
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
router.get("/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
            if(err){
                console.log(err);
            }
            else{
                res.render("campgrounds/show",{campground:foundcampground})
            }
        });
    });

function isLoggedIn(req,res,next){
      if(req.isAuthenticated()){
        return next();
      }
      res.redirect('/login');
    }

module.exports = router;
