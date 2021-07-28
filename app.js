const express = require("express");

const app = express();

const DEFAULT_NAME = "Default";

// Example items to render while we have no database
const listItems = {
  [DEFAULT_NAME]: ["throw out trash", "clean kitchen"],
  Shopping: ["apple", "banana", "avocado"],
  "Work Items": ["write code"],
};

app.set("view engine", "ejs");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", express.static("public"));

app.get("/:listTitle?", function (req, res) {
  const listTitle = req.params.listTitle || DEFAULT_NAME;
  const items = listItems[listTitle];
  if (items === undefined) {
    res.redirect("/");
  }
  res.render("list", { listTitle, items });
});

app.post("/:listTitle?", function (req, res) {
  const listTitle = req.params.listTitle || DEFAULT_NAME;
  const items = listItems[listTitle];
  if (items === undefined) {
    res.redirect("/");
  }
  const item = req.body.newItem;
  items.push(item);
  res.redirect(`/${listName}`);
});

app.listen(3000, function () {
  console.log("server is up!");
});
