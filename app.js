import express from "express";

import { DEFAULT_NAME } from "./constants.js";
import { List } from "./models.js";

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", express.static("public"));

app.get("/", async function (req, res) {
  res.redirect(`/list/${DEFAULT_NAME}`);
});

app.get("/list/:listTitle?", async function (req, res) {
  const listTitle = req.params.listTitle || DEFAULT_NAME;
  const list = await List.findOne({ name: listTitle }).exec();
  if (list === null) {
    res.redirect("/");
  }
  const items = list.items;
  const lists = (await List.find().exec()).map((list) => list.name);
  res.render("list", { listTitle, items, lists });
});

app.post("/list/:listTitle?", async function (req, res) {
  const listTitle = req.params.listTitle || DEFAULT_NAME;
  const list = await List.findOne({ name: listTitle }).exec();
  if (list === null) {
    res.redirect("/");
  }
  const items = list.items;
  const item = req.body.newItem;
  items.push({ item, done: false });
  await List.updateOne({ name: listTitle }, { items });
  res.redirect(`/list/${listTitle}`);
});

app.delete("/list/:listTitle", async function (req, res) {
  const listTitle = req.params.listTitle;
  if (listTitle === DEFAULT_NAME) {
    res.send("Can't delete default");
    return;
  }
  await List.deleteOne({ name: listTitle });
  res.send("200");
});

app.put("/list/:listTitle/:itemIndex", async function (req, res) {
  const listTitle = req.params.listTitle;
  const list = await List.findOne({ name: listTitle }).exec();
  if (list === null) {
    res.redirect("/");
  }
  const items = list.items;
  const itemIndex = parseInt(req.params.itemIndex);
  const checked = req.body.checked;
  items[itemIndex].done = checked;
  await List.updateOne({ name: listTitle }, { items });
  res.send("200");
});

app.delete("/list/:listTitle/:itemIndex", async function (req, res) {
  const listTitle = req.params.listTitle;
  const list = await List.findOne({ name: listTitle }).exec();
  if (list === null) {
    res.redirect("/");
  }
  const items = list.items;
  const itemIndex = parseInt(req.params.itemIndex);
  items = items.filter((_, i) => {
    return i !== itemIndex;
  });
  await List.updateOne({ name: listTitle }, { items });
  res.send("200");
});

app.post("/lists", async function (req, res) {
  const listTitle = req.body.listTitle;
  const newList = new List({
    name: listTitle,
    items: [],
  });
  newList.save();
  res.redirect(`/list/${listTitle}`);
});

app.listen(process.env.PORT || 3000, async function () {
  console.log("server is up!");
});
