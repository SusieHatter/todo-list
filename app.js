const express = require("express");

const app = express();

const items = [];

const workItems = [];

app.set("view engine", "ejs");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", express.static("public"));

app.get("/", function (req, res) {
  const today = new Date();
  options = { weekday: "long", day: "numeric", month: "long" };
  const day = today.toLocaleDateString("en-GB", options);

  res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function (req, res) {
  let item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", function (req, res) {
  let item = req.body.newItem;
  workItem.push(item);
  res.redirect("/work");
});

app.listen(3000, function () {
  console.log("server is up!");
});
