const express = require("express");

const app = express();

const DEFAULT_NAME = "Default";

// Example items to render while we have no database
const listItems = {
  [DEFAULT_NAME]: [
    { item: "throw out trash", done: false },
    { item: "clean kitchen", done: false },
  ],
  Shopping: [
    { item: "apple", done: false },
    { item: "banana", done: false },
    { item: "avocado", done: false },
  ],
  "Work Items": [{ item: "write code", done: false }],
};

app.set("view engine", "ejs");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", express.static("public"));

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

app.listen(3000, function () {
  console.log("server is up!");
});
