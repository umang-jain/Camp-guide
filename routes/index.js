var express  = require("express"),
    router   = express.Router();
    passport = require('passport'),
    User     = require("../models/user");

router.get("/",function(req,res){
    res.render("home");
});

router.get('/register', (req,res) => {
  res.render('login/register',{error:false});
});
router.post('/register', (req,res) => {
  User.register(new User({username: req.body.username,email:req.body.email}),req.body.password,(err,user) => {
    if(err){
      // req.flash('error',"Username already exists");
      return res.render('login/register',{error:"Username already exists"})
    }
    passport.authenticate('local')(req,res,() => {
      // req.flash('success','Welcome to Camp Guide' + user.username);
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
  // req.flash('success','You have been successfully logged out!');
  res.redirect('/campgrounds');
});

module.exports = router;
