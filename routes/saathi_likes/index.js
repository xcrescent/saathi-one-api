const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./config/config").get(process.env.NODE_ENV);
const app = express();
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(bodyParser.urlencoded({ extended: false }));
// console.log(db);
mongoose.set("strictQuery", false);
mongoose
  .connect(db.DATABASE+"saathi")
  .then(() => {
    console.log("connection successful");
  })
  .catch((e) => {
    console.log(e);
    console.log("no connection");
  });
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.status(200).send(`Welcome to Saathi Likes api`);
});


app.post("/like", async (req, res) => {
  console.log(req.body);
  try {
    var data = JSON.parse(req.body);
  } catch (e) {
    var data = req.body;
  }
  if (data.id == undefined) {
    res.send("id-not-found");
    return;
  }
  var post = await mongoose.connection.collection("likesCount").findOne({_id: mongoose.Types.ObjectId(data.id)});
  var postLike = await mongoose.connection.collection("likes").findOne({postId: data.id, uid: data.uid});
  if(postLike != null){
    var kre = await mongoose.connection.collection("likes").deleteOne({postId: data.id, uid: data.uid});
    var zre = await mongoose.connection
      .collection("likesCount")
      .updateOne(
        { _id: mongoose.Types.ObjectId(data.id) },
        { $set: { likes: post.likes - 1 } }
      );
    console.log(zre+" "+kre);
    res.send("disliked");
    return;
  }
  await mongoose.connection
    .collection("likes")
    .insertOne({ postId: data.id, uid: data.uid, date: new Date() });
  if (post == null) {
    console.log("post not found");
    var z = await mongoose.connection
      .collection("likesCount")
      .insertOne({ _id: mongoose.Types.ObjectId(data.id), likes: 1 });
    // await mongoose.connection.collection("likes").insertOne({postId: data.id, uid: data.uid, date: new Date()});
    console.log(z);
    res.send("success");
    return;
  }
  
  var re = await mongoose.connection
    .collection("likesCount")
    .updateOne(
      { _id: mongoose.Types.ObjectId(data.id) },
      { $set: { likes: post.likes+1 } }
    );
    console.log(re);
  res.send("success");
});


// app.post("/decremetLike", async (req, res) => {
//   console.log(req.body);});


app.get('/getLikes', async (req, res) => {
  console.log(req.query);
  var post = await mongoose.connection.collection("likesCount").findOne({_id: mongoose.Types.ObjectId(req.query.id)});
  if(post == null){
    res.send("0");
    return;
  }
  res.send(post.likes.toString());
});

var server = app.listen(PORT, function () {
  var host = server.address().address;
  console.log("App listening at http://%s:%s", host, PORT);
});