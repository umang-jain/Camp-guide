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
      req.flash('error',err.message);
      return res.render('login/register')
    }
    passport.authenticate('local')(req,res,() => {
      req.flash('success','Welcome to Camp Guide' + user.username);
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
  req.flash('success','You have been successfully logged out!');
  res.redirect('/campgrounds');
});

module.exports = router;
