var express        = require("express"),
    app            = express(),
    bodyparser     = require("body-parser"),
    mongoose       = require("mongoose"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    seedDB = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/campguide");
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"))

app.get("/",function(req,res){
    res.render("home");
});
app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{campgrounds:allcampgrounds});
        }
    })
});
app.post("/campgrounds",function(req,res){
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
            res.redirect("/campgrounds");
        }
    });
});
app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
            if(err){
                console.log(err);
            }
            else{
                res.render("show",{campground:foundcampground})
            }
        });
    });

app.listen("3000",function(){
   console.log("Starting server on port 3000");
});
