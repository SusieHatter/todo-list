import { List } from "../models.js";
import { DEFAULT_NAME } from "../constants.js";

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

const lists = Object.entries(listItems).map(
  ([name, items]) => new List({ name, items })
);

List.insertMany(lists, function (err) {
  if (err) {
    console.log(err, "There is an error in the list");
  } else {
    console.log("Lists added");
  }
});
