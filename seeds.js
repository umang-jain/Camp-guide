var mongoose= require("mongoose");
var Campground= require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");

var data = [
    {
        name:"Spiti Valley, Himachal Pradesh",
        image:"https://www.indianholiday.com/blog/wp-content/uploads/2014/12/Lahual-spiti.jpg",
        description:"Nestled in the Keylong district of Himachal Pradesh, Spiti Valley is one of the desired camping sites for adventure enthusiasts and trekkers. It is an ideal place for camping in summers, to get respite from the hot sun. May and June are the perfect months to enjoy the natural setting of the valley.",
    },
    {
        name:"Rishikesh, Uttarakhand",
    image:"https://www.indianholiday.com/blog/wp-content/uploads/2014/06/Camping-in-Rishikesh.jpg",
    description:"Situated in the lap of the Great Himalayas, Rishikesh is a major pilgrim destination for Hindus. It is one of the most sought after camping destinations in India and a popular Indian pilgrimage destination. One can go for rafting and can try hands at other adventure sports. It too attracts people from all over the world.",
    },
    {
        name:"Jaisalmer, Rajasthan",
        image:"https://www.indianholiday.com/blog/wp-content/uploads/2014/06/Camping-in-Jaisalmer.jpg",
        description:"The natural setting of Jaisalmer makes it a perfect paradise for campers. Fondly known as the ‘Golden City of India’, Jaisalmer is indeed a trekker’s paradise. The famous Sam Sand Dunes offer some of the amazing camping sites in India. The son touched gleaming sands create a silhouette against the sand dunes. However, if you want to indulge yourself, The Serai will provide you a wonderful experience. It houses 21 large canvas tents built on a base of Jaisalmer stone, set away from it all on 30 acres of desert scrub.",
    }

]

function seedDB(){
    Campground.remove({},function(err,campground){
        if(err){
            console.log(err);
        } else{
            console.log("Campgrounds Removed");
            data.forEach(function(seed){
                Campground.create(seed,function(err,data){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Added Campground");
                        Comment.create({
                            text:"this place is great.but i wish there was network",
                            author:"Homer"
                        },function(err,comment){
                            if(err){
                                console.log(err);
                            }else{
                                data.comments.push(comment);
                                data.save();
                                console.log("created new comment");
                                // User.remove({},(err,user) => {
                                //   console.log('User Removed!');
                                // })
                            }
                        })
                    }
                });
            });
        }
    });
}

module.exports = seedDB;
