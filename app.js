var express                 = require("express"),
    app                     = express(),
    bodyparser              = require("body-parser"),
    mongoose                = require("mongoose"),
    flash                   = require('connect-flash'),
    passport                = require('passport'),
    LocalStrategy           = require('passport-local'),
    methodOverride          = require('method-override'),
    Campground              = require("./models/campground"),
    Comment                 = require("./models/comment"),
    User                    = require("./models/user"),
    seedDB                  = require("./seeds");

// seedDB();

var commentRoutes     = require('./routes/comments'),
    campgroundRoutes  = require('./routes/campgrounds'),
    indexRoutes       = require('./routes/index');

var port = process.env.PORT || 3000;
// var dbUrl = process.env.DATABASEURL || "mongodb://localhost/campguide";
mongoose.connect("mongodb://admin123:admin123@ds135427.mlab.com:35427/camp-guide");

app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname +"/public"));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();
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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//--------- ROUTES ----------------------------

app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/',indexRoutes);

//----------- PORT -----------------
app.listen(port,function(){
   console.log("Starting server on port " + port);
});
