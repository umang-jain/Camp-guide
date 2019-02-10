var express  = require("express"),
    router   = express.Router();
    passport = require('passport'),
    User     = require("../models/user");

router.get("/",function(req,res){
    res.render("home");
});

router.get('/register', (req,res) => {
  res.render('login/register');
});
router.post('/register', (req,res) => {
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

router.get('/login', (req,res) => {
  res.render('login/login')
});
router.post('/login', passport.authenticate('local',{
  successRedirect:'/campgrounds',
  failureRedirect:'/login'
}), (req,res) => {
});
router.get('/logout', (req, res) => {
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

module.exports = router;
