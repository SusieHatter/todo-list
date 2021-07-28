function deleteItem(listTitle, itemIndex) {
  fetch(`/list/${listTitle}/${itemIndex}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  }).then(() => location.reload());
}

function deleteList(listTitle) {
  fetch(`/list/${listTitle}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  }).then(() => location.reload());
}
