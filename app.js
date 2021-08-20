const express = require("express");
const mongoose = require("mongoose");
const app = express();

const DEFAULT_NAME = "Default";

app.set("view engine", "ejs");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todo list!",
});

const item2 = new Item({
  name: "Click the + button to add a new item",
});

const item3 = new Item({
  name: "Click X to delete an item",
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, function (err) {
  if (err) {
    console.log(err, "There is an error in the item");
  } else {
    console.log("Items added");
  }
});

app.use("/", express.static("public"));

// Example items to render while we have no database
// const listItems = {
//   [DEFAULT_NAME]: [
//     { item: "throw out trash", done: false },
//     { item: "clean kitchen", done: false },
//   ],
//   Shopping: [
//     { item: "apple", done: false },
//     { item: "banana", done: false },
//     { item: "avocado", done: false },
//   ],
//   "Work Items": [{ item: "write code", done: false }],
// };

app.get("/", function (req, res) {
  res.redirect(`/list/${DEFAULT_NAME}`);
});

app.get("/list/:listTitle?", function (req, res) {
  const listTitle = req.params.listTitle || DEFAULT_NAME;
  const items = listItems[listTitle];
  if (items === undefined) {
    res.redirect("/");
  }
  const lists = Object.keys(listItems);
  res.render("list", { listTitle, items, lists });
});

app.post("/list/:listTitle?", function (req, res) {
  const listTitle = req.params.listTitle || DEFAULT_NAME;
  const items = listItems[listTitle];
  if (items === undefined) {
    res.redirect("/");
  }
  const item = req.body.newItem;
  items.push({ item, done: false });
  res.redirect(`/list/${listTitle}`);
});

app.delete("/list/:listTitle", function (req, res) {
  const listTitle = req.params.listTitle;
  if (listTitle === DEFAULT_NAME) {
    res.send("Can't delete default");
    return;
  }
  delete listItems[listTitle];
  res.send("200");
});

app.put("/list/:listTitle/:itemIndex", function (req, res) {
  const listTitle = req.params.listTitle;
  const items = listItems[listTitle];
  if (items === undefined) {
    res.redirect("/");
  }
  const itemIndex = parseInt(req.params.itemIndex);
  const checked = req.body.checked;
  items[itemIndex].done = checked;
  res.send("200");
});

app.delete("/list/:listTitle/:itemIndex", function (req, res) {
  const listTitle = req.params.listTitle;
  const items = listItems[listTitle];
  if (items === undefined) {
    res.redirect("/");
  }
  const itemIndex = parseInt(req.params.itemIndex);
  listItems[listTitle] = items.filter((_, i) => {
    return i !== itemIndex;
  });
  res.send("200");
});

app.post("/lists", function (req, res) {
  const listTitle = req.body.listTitle;
  listItems[listTitle] = [];
  res.redirect(`/list/${listTitle}`);
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is up!");
});
