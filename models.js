import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const List = mongoose.model("list", {
  name: String,
  items: [{ item: String, done: Boolean }],
});
