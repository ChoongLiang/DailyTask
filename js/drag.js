var taskCount = 0;

//Regrab .list when new task is added
$(document).ready(function() {
  startTime();
  updateTaskList();
  UpdateTaskListFunctionality();
  storage_init();

  $( '#deleteArea' ).hide(); // Hide 'trash bin' 
  //$( '#clearTaskBtn' ).hide(); // Hide clear all button
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

function updateTaskCount() {
  $( '#taskCount' ).fadeIn(500);
  window.save_task_count(taskCount);
  document.getElementById('taskCount').innerHTML = taskCount;

}

// "enter" key should check for new task form instead of refreshing the page
$(document).on('keypress',function(e) {
    if(e.which == 13) {
        newTaskBtn();
    }
});

// Last step, grab form value and verify
function newTaskBtn(){
  task = $('#newTaskForm').val();

  if(task === "" || task === "null") {
    console.log("Empty field!");
  }else{
    // Append as list item
    $( "#todoList-ul" ).append('<div class="list"><li draggable="true">' + task + '</li></div>');
    // console.log(task)
    updateTaskList();
    UpdateTaskListFunctionality();
    window.saveChanges(task);
  }
}

function updateTaskList() {
  $('.list').draggable({
    helper:"clone",
    containment:"document"
  })
}

function UpdateTaskListFunctionality() {
  $( ".list" ).bind('dragstart', function (event) {  // Drag start to show delete area
    $( '#deleteArea' ).fadeIn(500);
  }).bind('dragstop', function (event) { // Drag stop to hide delete area
    $( '#deleteArea' ).fadeOut(500);
  }).hover( function() {                // Double click to delete
    $( this ).dblclick( function(task) {
      $( this ).css( "text-decoration", "line-through" ).delay(200);
      $( this ).fadeOut(500, function() {
        chrome.storage.local.get({"task_id": []}, function(items) {
          var temp_list = [];
          for (var i = 0; i < items.task_id.length; i++) {
            if ( task.currentTarget.innerText !== items.task_id[i] ) {
              temp_list.push(items.task_id[i]);
            }
          }
          chrome.storage.local.set({"task_id": temp_list});
          console.log('deleted task');
        })
        $( this ).remove();
        taskCount++;
        updateTaskCount();
      });
    });
  });
}


$(function() {

  // $( ".list" ).bind('dragstart', function (event) {  // Drag start to show delete area
  //   $( '#deleteArea' ).fadeIn(500);
  // }).bind('dragstop', function (event) { // Drag stop to hide delete area
  //   $( '#deleteArea' ).fadeOut(500);
  // }).hover( function() {                // Double click to delete
  //   $( this ).dblclick( function() {
  //     $( this ).css( "text-decoration", "line-through" ).delay(200);
  //     $( this ).fadeOut(500, function() {
  //       $( this ).remove();
  //       taskCount += 1;
  //       updateTaskCount();
  //     });
  //   });
  // });

  // Disable form submit (auto refresh if enter is pressed)
  $( "form" ).submit(function() { return false; });

  // Then the button have to listen
  $( "#newTaskBtn" ).click(function(){ newTaskBtn(); });

  // Clear all button
  $( '#clearBtn' ).mouseenter(function() {
      $( '#clearTaskBtn' ).show()
      $( '#clearTaskBtn' ).click(function() {
        $( '#todoList li' ).each(function() { //This is to remove all task list
          $( this ).remove();
        }); 
      chrome.storage.local.get({"task_id": []}, function(items) {
        items.task_id = [];
        console.log("Cleared chrome storage");
        chrome.storage.local.set(items);
      })
      })
    });

  // Auto clear input form
  $('input:text').focus(
    function(){
        $(this).val('');
    });

  $( "#container-1, #container-2, #container-3, #container-4" ).droppable({
    drop: function( event, ui ) {
      ui.draggable.detach().appendTo($( this ));
    }
  });

  $( "#todoList" ).droppable({
    drop: function( event, ui ) {
      // var targetElem = $(this).attr("id");
      // $( ui.draggable ).appendTo( this );
      $( ui.draggable ).detach().appendTo($( "#todoList-ul" ));
      // console.log(this);
    }
  }).sortable();

  $( "#deleteArea" ).droppable({
    drop: function( event, ui ) {
      ui.draggable.remove();
      var task_text = ui.draggable[0].innerText;
      chrome.storage.local.get({"task_id": []}, function(items) {
          var temp_list = [];
          for (var i = 0; i < items.task_id.length; i++) {
            if ( task_text !== items.task_id[i] ) {
              temp_list.push(items.task_id[i]);
            }
          }
          chrome.storage.local.set({"task_id": temp_list});
          console.log('deleted task');
        })
      $( this ).fadeOut(500);
    }
  });

})

function storage_init(storage_count) {
  chrome.storage.local.get(null, function(items) {
    var task_keys = Object.keys(items);
    console.log('ALL KEYS', task_keys);
    // console.log(items["task_id"]);

    var saved_task_list = items["task_id"];

    for (var i = 0; i < saved_task_list.length; i++) {
      $( "#todoList-ul" ).append('<div class="list"><li draggable="true">' + saved_task_list[i] + '</li></div>');
      updateTaskList();
      UpdateTaskListFunctionality();
    }

    var saved_task_count = items["task_count"];
    document.getElementById('taskCount').innerHTML = saved_task_count;
    taskCount = saved_task_count;
  })
}


// function dragstart(e){
//   item = this;
//   $( '#deleteArea' ).fadeIn(500); // Make 'trash bin' visible
// }

// const boxes = document.getElementsByClassName( 'boxes' );
// for ( const box of boxes ) {
//   box.addEventListener( "dragover", dragover );
//   box.addEventListener( "dragenter", dragenter );
//   box.addEventListener( "drop", drop );
// }

// // An array of id to add drag event
// const idsToIterate = [ 'todoList', 'deleteArea' ];
// for ( i = 0; i < idsToIterate.length; i++){
//   const elem = document.getElementById( idsToIterate[i] );
//     elem.addEventListener( "dragover", dragover );
//     elem.addEventListener( "dragenter", dragenter );
//     elem.addEventListener( "drop", drop );
// }

// function dragover( e ) {
//   e.preventDefault();  
// }

// function dragenter( e ) {
//   e.preventDefault();
// }

// function drop() {
//   if ( this.id === "todoList" ){
//     $( "#todoList ul" ).append( item );
//   } else if ( this.id === "deleteArea"){
//     item.remove();
//     console.log('Task Removed');
//   } else {
//     this.append( item );
//   }

//   // Hide 'trash bin' 
//   $( '#deleteArea' ).fadeOut(500);
// }

// Triggered whenever a new task is added
// User can delete a task in the main board by double clicking 




// Clear input
// function clearInput() {
// $('input:text').focus(
//     function(){
//         $(this).val('');
//     });
// }

// $('.list').draggable({
//   helper:"clone",
//   containment:"document"
// });

// $( "#container-1, #container-2, #container-3, #container-4" ).droppable({
//   drop: function( event, ui ) {
//     ui.draggable.detach().appendTo($( this ));
//   }
// });

// $( "#todoList" ).droppable({
//   activeClass: "ui-state-hover",
//   hoverClass: "ui-state-active",
//   accept: ":not(.ui-sortable-helper)",
//   drop: function( event, ui ) {
//     var targetElem = $(this).attr("id");
//     $( ui.draggable ).appendTo( this );
//   }
// })

// $( "#todoList-ul").sortable();

// $( "#deleteArea" ).droppable({
//   drop: function( event, ui ) {
//     ui.draggable.remove();
//     $( this ).fadeOut(500);
//   }
// });

// $( "#todoList" ).sortable({
//   connectWith: ".connectedSortable",
//   receive: function( event, ui ) {
//       $(ui.item).appendTo(this);
//   }
// }).disableSelection();

//New method but not fully working
// function dragNDrop() {
//   $( ".list" ).draggable();
//   $( ".container" ).droppable({
//     drop: function( event, ui ) {
//       ui.draggable.detach().appendTo($(this));
//     }
//   });
//   $( "#container-1" ).droppable({
//     drop: function( event, ui ) {
//       console.log(this);
//       $( this ).append($(ui.draggable).find('li'));
//     }
//   });
// } 