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

var commentRoutes     = require('./routes/comments'),
    campgroundRoutes  = require('./routes/campgrounds'),
    indexRoutes       = require('./routes/index');

mongoose.connect("mongodb://localhost/campguide",{ useNewUrlParser: true });
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"))
seedDB();
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

//--------- ROUTES ----------------------------

app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/',indexRoutes);

//----------- PORT -----------------
app.listen("3000",function(){
   console.log("Starting server on port 3000");
});
