var express = require('express');
var router = express.Router();
const Post = require("../routes/hellohellohellow-whataboutadate-2405/models/posts");
const MongoClient = require("mongodb").MongoClient;
// const url = 'mongodb://127.0.0.1:27017';
//
// const dbName = 'game-of-thrones';
// let db;

// MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
//   if (err) return console.log(err)
//
//   // Storing a reference to the database, so you can use it later
//   db = client.db(dbName)
//   console.log(`Connected MongoDB: ${url}`)
//   console.log(`Database: ${dbName}`)
// }).then(r =>{
//
// }).catch(err => console.log(err));
const mongoose = require("mongoose");
// const url = 'mongodb://127.0.0.1:27017/game-of-thrones';

const dbEnv = require("../config/config").get(process.env.NODE_ENV);
console.log(process.env.NODE_ENV);
console.log(process.env.MONGODB_URI);
var url = dbEnv.DATABASE + 'saathi';
console.log(url);
mongoose.connect(url, { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', _ => {
  console.log('Database connected:', url);
});

db.on('error', err => {
  console.error('connection error:', err);
});
// mongoose.set("strictQuery", false);
// main().catch(err => console.log(err));

// async function main() {
  // await mongoose.connect(db.DATABASE)
  // // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  // console.log("connected");
// }


router.get("/", function (req, res, next) {
  res.status(200).send(`Welcome to login , sign-up api`);
  // console.log(db);
  next();
});

router.post("/addPost",async (req,res, next)=>{
  console.log(req.body);
  try {
    var data = JSON.parse(req.body);
  } catch (e) {
    var data = req.body;
  }
  
  var newPost = new Post({
    name: data.name,
    profileUrl: data.profileUrl,
    headline: data.headline,
    isVideoPost: data.isVideoPost,
    description: data.description,
    video: data.video,
    image: data.image,
    comments: data.comments,
    likes: data.likes,
    tags: data.tags,
    isOnline: data.isOnline,
  });
  var re = await db.collection("posts").insertOne(newPost);
      // .collection("posts").insertOne(newPost);
  console.log(re.insertedId);
  res.send("he");
  next();
})

router.post("/likePost", async (req, res,next) => {
  console.log(req.body);
  try {
    var data = JSON.parse(req.body);
  } catch (e) {
    var data = req.body;
  }
  var re = await db
    .collection("posts")
    .updateOne(
      { _id: mongoose.Types.ObjectId(data.id) },
      { $set: { likes: data.likes } }
    );
  console.log(re);
  res.send("success");
});


router.get("/posts", async (req, res, next) => {
    console.log(req.body);
    Post.find({}).sort({post_added:-1}).then((data) => {
      // console.log(res);
      res.status(200).send(data);
    }).catch((err) => {
      console.log(err);
    });
});

router.post("/update", function (req, res) {
  StudentModel.findByIdAndUpdate(
    req.body.id,
    { Name: req.body.Name },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.send(data);
        console.log("Data updated! " + data);
      }
    }
  );
});

module.exports = router;