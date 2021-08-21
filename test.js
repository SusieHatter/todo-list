import { List } from "./models.js";

console.log(await List.findOne({ name: "blah" }).exec());
