const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema({
  name: String,
  profileUrl: String,
  headline: String,
  isVideoPost: Boolean,
  description: String,
  video: String,
  image: String,
  comments: String,
  likes: String,
  tags: String,
  isOnline: Boolean,
  post_added: {
    type: Date,
    default: Date.now,
  },
});
// postSchema.pre("save", async function (next) {
//   // if (this.isModified("password")) {
//   //   this.password = await bcrypt.hash(this.password, 10);
//   //   this.confirmpassword = await bcrypt.hash(this.password, 10);
//   // }

//   next();
// });
const Post = mongoose.model("Post", postSchema);
module.exports = Post;