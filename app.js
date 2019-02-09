var express                 = require("express"),
    app                     = express(),
    bodyparser              = require("body-parser"),
    mongoose                = require("mongoose"),
    passport                = require('passport'),
    LocalStrategy           = require('passport-local'),
    Campground              = require("./models/campground"),
    Comment                 = require("./models/comment"),
    User                    = require("./models/user"),
    seedDB                  = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/campguide",{ useNewUrlParser: true });
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"))

//---------- PASSPORT CONFIGURATION --------------

app.use(require('express-session')({
  secret : 'Hello there this is a secret!',
  resave: false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.currentUser = req.user;
  next();
});

//--------- ROUTES -------------------

app.get("/",function(req,res){
    res.render("home");
});

//---------- CAMPGROUNDS ------------

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{campgrounds:allcampgrounds});
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
    res.render("campgrounds/new");
});
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
            if(err){
                console.log(err);
            }
            else{
                res.render("campgrounds/show",{campground:foundcampground})
            }
        });
    });

//------------- COMMENTS  ---------------

app.get("/campgrounds/:id/comments/new",isLoggedIn,(req,res) => {
  Campground.findById(req.params.id,(err,campground) => {
    if(err){
      console.log(err);
    }else{
    //  console.log(req.isAuthenticated());
      res.render('comments/new',{campground});
    }
  });
});

app.post('/campgrounds/:id/comments/',isLoggedIn ,(req,res) => {
  Campground.findById(req.params.id,(err,campground) => {
    if(err){
      console.log(err);
      res.redirect('/campgrounds')
    }else{
      Comment.create(req.body.comment,(err,comment) => {
        campground.comments.push(comment);
        campground.save();
        res.redirect('/campgrounds/'+req.params.id)
      });
    }
  });
});

//----------- AUTHENTICATION ROUTES -----------------

app.get('/register', (req,res) => {
  res.render('login/register');
});
app.post('/register', (req,res) => {
  User.register(new User({username: req.body.username}),req.body.password,(err,user) => {
    if(err){
      console.log(err);
      return res.render('login/register')
    }
    passport.authenticate('local')(req,res,() => {
      res.redirect('/campgrounds');
    })
  })
});

app.get('/login', (req,res) => {
  res.render('login/login')
});
app.post('/login', passport.authenticate('local',{
  successRedirect:'/campgrounds',
  failureRedirect:'/login'
}), (req,res) => {
});
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/campgrounds');
});

//--------- MIDDLEWARE -------------
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

//----------- PORT -----------------
app.listen("3000",function(){
   console.log("Starting server on port 3000");
});
