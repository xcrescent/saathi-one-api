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
  res.status(200).send(`Welcome to Saathi Comments api`);
});


app.post("/comment", async (req, res) => {
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
  var post = await mongoose.connection.collection("commentsCount").findOne({_id: mongoose.Types.ObjectId(data.id)});
  await mongoose.connection
    .collection("comments")
    .insertOne({ postId: data.id, uid: data.uid, date: new Date(), comment: data.comment });
  if (post == null) {
    console.log("post not found");
    var z = await mongoose.connection
      .collection("commentsCount")
      .insertOne({ _id: mongoose.Types.ObjectId(data.id), comments: 1 });
    // await mongoose.connection.collection("comments").insertOne({postId: data.id, uid: data.uid, date: new Date()});
    console.log(z);
    res.send("success");
    return;
  }
  
  var re = await mongoose.connection
    .collection("commentsCount")
    .updateOne(
      { _id: mongoose.Types.ObjectId(data.id) },
      { $set: { comments: post.comments+1 } }
    );
    console.log(re);
  res.send("success");
});

app.post('/deleteComment' ,async (req , res)=> {
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
  var post = await mongoose.connection
    .collection("commentsCount")
    .findOne({ _id: mongoose.Types.ObjectId(data.id) });
  var postComment = await mongoose.connection
    .collection("comments")
    .findOne({
      postId: data.id,
      uid: data.uid,
      _id: mongoose.Types.ObjectId(data.commentId),
    });
  if(postComment != null){
    var kre = await mongoose.connection
      .collection("comments")
      .deleteOne({
        postId: data.id,
        uid: data.uid,
        _id: mongoose.Types.ObjectId(data.commentId),
      });
    var zre = await mongoose.connection
      .collection("commentsCount")
      .updateOne(
        { _id: mongoose.Types.ObjectId(data.id) },
        { $set: { comments: post.comments - 1 } }
      );
    console.log(zre+" "+kre);
    res.send("deleted");
    return;
  }
   res.send('failed')

})

app.get('/getComments', async (req, res) => {
  console.log(req.query);
  var count = await mongoose.connection.collection("commentsCount").findOne({_id: mongoose.Types.ObjectId(req.query.id)});
  var post = await mongoose.connection.collection("comments").find({postId: req.query.id}).sort({date: -1}).toArray();
  console.log(post);
  if(count == null){
    res.send("0");
    return;
  }
  res.json({count:count.comments.toString(),comments:post});
});

var server = app.listen(PORT, function () {
  var host = server.address().address;
  console.log("App listening at http://%s:%s", host, PORT);
});