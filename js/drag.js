function handleDragStart(e) {
  this.style.color = 'red';  // this / e.target is the source node.
}

// var cols = document.querySelectorAll('#columns .column');
// [].forEach.call(cols, function(col) {
//   col.addEventListener('dragstart', handleDragStart, false);
// });