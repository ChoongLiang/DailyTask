// credits: https://www.html5rocks.com/en/tutorials/dnd/basics/

// Drag element
// var dragSrcEl = null;

// function handleDragStart(e) {
//   this.style.color = 'red';  // this / e.target is the source node.

//   dragSrcEl = this;

//   e.dataTransfer.effectAllowed = 'move';
//   e.dataTransfer.setData('text/html', this.innerHTML);
// }

// function handleDragOver(e) {
//   if (e.preventDefault) {
//     e.preventDefault(); // Necessary. Allows us to drop.
//   }

//   e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

//   return false;
// }

// function handleDragEnter(e) {
//   // this / e.target is the current hover target.
//   this.classList.add('over');
//   console.log(this.classList);
// }

// function handleDragLeave(e) {
//   this.classList.remove('over');  // this / e.target is previous target element.
//   console.log(this.classList);
// }

// function handleDrop(e) {
//   // this / e.target is current target element.

//   if (e.stopPropagation) {
//     e.stopPropagation(); // stops the browser from redirecting.
//   }
//   if (dragSrcEl != this) {
//     // Set the source column's HTML to the HTML of the column we dropped on.
//     dragSrcEl.innerHTML = this.innerHTML;
//     this.innerHTML = e.dataTransfer.getData('text/html');
//     //console.log('this: ', this.innerHTML.classList);
//     //this.innerHTML.classList.add('listedItem');
//   }

//   return false;
// }

// function handleDragEnd(e) {
//   // this/e.target is the source node.

//   [].forEach.call(list, function (item) {
//     item.classList.remove('over');
//   });
// }

// var list = document.querySelectorAll('.list');
// [].forEach.call(list, function(item) {
//   item.addEventListener('dragstart', handleDragStart, false);
//   item.addEventListener('dragenter', handleDragEnter, false);
//   item.addEventListener('dragover', handleDragOver, false);
//   item.addEventListener('dragleave', handleDragLeave, false);
//   item.addEventListener('drop', handleDrop, false);
//   item.addEventListener('dragend', handleDragEnd, false);
// });

// Rework

var item = null;
var task = null;

// Regrab .list when new task is added
$(document).ready(function() {
    updateTaskList();
    // $("#sortable").sortable();
    // $( "#sortable" ).disableSelection();

    // Hide 'trash bin' 
  $( '#deleteArea' ).hide();
});

function updateTaskList() {
  const todoList = document.getElementsByClassName( 'list' );
  // console.log( todoList );

    for( const i of todoList ) {
      // console.log(i);
      i.addEventListener( "dragstart", dragstart );
    };
}

function dragstart(e){
  item = this;
  // console.log(item);

  // Make 'trash bin' visible
  $( '#deleteArea' ).show();
}

const boxes = document.getElementsByClassName( 'boxes' );
for ( const box of boxes ) {
  box.addEventListener( "dragover", dragover );
  box.addEventListener( "dragenter", dragenter );
  box.addEventListener( "drop", drop );
}

// An array of id to add drag event
const idsToIterate = [ 'todoList', 'deleteArea' ];
for ( i = 0; i < idsToIterate.length; i++){
  const elem = document.getElementById( idsToIterate[i] );
    elem.addEventListener( "dragover", dragover );
    elem.addEventListener( "dragenter", dragenter );
    elem.addEventListener( "drop", drop );
}

function dragover( e ) {
  e.preventDefault();  
}

function dragenter( e ) {
  e.preventDefault();
}

function drop() {
  // console.log(item);
  // console.log(this);

  if ( this.id === "todoList" ){
    $( "#todoList ul" ).append( item );
  } else if ( this.id === "deleteArea"){
    // $( ".list" ).remove(); This is to remove all task list
    item.remove();
    console.log('Task Removed');
  } else {
    this.append( item );
  }

  // Hide 'trash bin' 
  $( '#deleteArea' ).hide();
}