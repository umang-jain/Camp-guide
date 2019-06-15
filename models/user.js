var mongoose              = require("mongoose");
    passportLocalMongoose = require('passport-local-mongoose')

var UserSchema = new mongoose.Schema({
    email:String,
    username:{
      type:String,
      isUnique:true
    },
    password:String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);
