var item = null;
var task = null;
var taskCount = 0;

// Regrab .list when new task is added
$(document).ready(function() {
  startTime();
  updateTaskCount();
  updateTaskList();

  $( '#deleteArea' ).hide(); // Hide 'trash bin' 
  $( '#clearTaskBtn' ).hide(); // Hide clear all button
});

// Date & time
function startTime() {
  var today = new Date(),
      weekday = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'),
      dayOfWeek = weekday[today.getDay()],
      domEnder = function() { var a = today; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
      dayOfMonth = today + ( today.getDate() < 10) ? today.getDate() + domEnder : today.getDate() + domEnder,
      months = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'),
      curMonth = months[today.getMonth()],
      curYear = today.getFullYear(),
      curHour = today.getHours() > 12 ? today.getHours() - 12 : (today.getHours() < 10 ? "0" + today.getHours() : today.getHours()),
      curMinute = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes(),
      curSeconds = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds(),
      curMeridiem = today.getHours() > 12 ? "PM" : "AM";

  document.getElementById('date').innerHTML = dayOfWeek + " " + curMonth + " " + dayOfMonth + ", " + curYear;

  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('time').innerHTML =
  h + ":" + m + ":" + s;
  var t = setTimeout(startTime, 500);
}

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}

function updateTaskList() {
  const todoList = document.getElementsByClassName( 'list' );
    for( const i of todoList ) {
      i.addEventListener("dragstart", dragstart);
    };
    deleteTask();
}

function updateTaskCount() {
  $( '#taskCount' ).fadeIn(500);
  document.getElementById('taskCount').innerHTML = taskCount;
}

function dragstart(e){
  item = this;
  $( '#deleteArea' ).fadeIn(500); // Make 'trash bin' visible
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
  if ( this.id === "todoList" ){
    $( "#todoList ul" ).append( item );
  } else if ( this.id === "deleteArea"){
    item.remove();
    console.log('Task Removed');
  } else {
    this.append( item );
  }

  // Hide 'trash bin' 
  $( '#deleteArea' ).fadeOut(500);
}

// Triggered whenever a new task is added
// User can delete a task in the main board by double clicking 
function deleteTask() {
  $( '.list' ).hover( function() {
    $( this ).dblclick( function() {
      $( this ).css( "text-decoration", "line-through" ).delay(200);
      $( this ).fadeOut(500, function() {
        $( this ).remove();
        taskCount += 1;
        updateTaskCount();
      });
    });
  })
}

// "enter" key should check for new task form instead of refreshing the page
$(document).on('keypress',function(e) {
    if(e.which == 13) {
        newTaskBtn();
    }
});

// Also we have to disable form submit (auto refresh if enter is pressed)
$(function() {
    $("form").submit(function() { return false; });
});

// Then the button have to listen
$("#newTaskBtn").click(function(){
  newTaskBtn();
})

// Last step, grab form value and verify
function newTaskBtn(){
  task = $('#newTaskForm').val();

  if(task === "" || task === "null") {
    console.log("Empty field!");
  }else{
    // Append as list item
    $("#todoList ul").append('<li draggable="true" class="list">' + task + '</li>');
    console.log(task)
    updateTaskList();
    clearInput();
  }
}

// Clear all button
$( '#clearBtn' )
  .mouseenter(function() {
    $( '#clearTaskBtn' ).show()
    $( '#clearTaskBtn' ).click(function() {
      $( '#todoList ul li' ).each(function() { //This is to remove all task list
        $( this ).remove();
      }); 
    })
  })
  .mouseleave(function() {
    $( '#clearTaskBtn' ).fadeOut(500);
  })

// Clear input
function clearInput() {
$('input:text').focus(
    function(){
        $(this).val('');
    });
}

// New method but not fully working
// function dragNDrop() {
//   $( ".list" ).draggable();
//   $( "#container-1" ).droppable({
//     drop: function( event, ui ) {
//       console.log(this);
//       $( this ).append($(ui.draggable).find('li'));
//     }
//   });
// } 