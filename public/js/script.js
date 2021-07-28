function deleteItem(listTitle, itemIndex) {
  fetch(`/list/${listTitle}/${itemIndex}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  }).then(() => location.reload());
}
