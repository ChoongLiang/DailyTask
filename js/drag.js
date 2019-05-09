var taskCount = 0;
var totalTaskCount = 0;
const tutorial_text = "Double click to complete task";

//Regrab .list when new task is added
$(document).ready(function() {
  tutorial();
  new_storage_init();
  startTime();
  updateTaskList();
  UpdateTaskListFunctionality();

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
  document.getElementById('taskCount').innerHTML = (taskCount + " / " + totalTaskCount);
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
    updateTaskList();
    UpdateTaskListFunctionality();
    window.saveChanges(task);
    document.getElementById('newTaskForm').value = "";
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
        if (task.currentTarget.innerText === tutorial_text){
          storage.set({[first_time]: 1});
        }
        else {
          storage.get({[key]: []}, function(items) {
            var new_task_list = items[key].filter(function(filtered) {
              return filtered[0] !== task.currentTarget.innerText;
            })
            storage.set({[key]: new_task_list});
          })
        }
        $( this ).remove();
        taskCount++;
        updateTaskCount();
      });
    });
  });
}


$(function() {

  // Disable form submit (auto refresh if enter is pressed)
  $( "form" ).submit(function(event, template) {
    event.preventDefault();
    return false; 
  });

  // Then the button have to listen
  $( "#newTaskBtn" ).click(function(){ newTaskBtn(); });

  // Clear all button
  $( '#clearBtn' ).mouseenter(function() {
      $( '#clearTaskBtn' ).show()
      $( '#clearTaskBtn' ).click(function() {
        $( '#todoList li' ).each(function() { //This is to remove all task list
          $( this ).remove();
        }); 
      storage.get({[key]: []}, function(items) {
        var new_task_list = items[key].filter(function(filtered) {
            return filtered[1] !== 0;
        })
        storage.set({[key]: new_task_list});
      })
      })
    });

  // Auto clear input form
  $('input:text').focus(
    function(){
        $(this).val('');
    });

  // Droppables
  $( "#container-1").droppable({
    drop: function( event, ui ) {
      ui.draggable.detach().appendTo($(this));
      window.save_tasks_in_boxes(1, ui.draggable[0].innerText);
    }
  })
  $( "#container-2").droppable({
    drop: function( event, ui ) {
      ui.draggable.detach().appendTo($(this));
      window.save_tasks_in_boxes(2, ui.draggable[0].innerText);
    }
  })
  $( "#container-3").droppable({
    drop: function( event, ui ) {
      ui.draggable.detach().appendTo($(this));
      window.save_tasks_in_boxes(3, ui.draggable[0].innerText);
    }
  })
  $( "#container-4").droppable({
    drop: function( event, ui ) {
      ui.draggable.detach().appendTo($(this));
      window.save_tasks_in_boxes(4, ui.draggable[0].innerText);
    }
  })

  $( "#todoList" ).droppable({
    drop: function( event, ui ) {
      $( ui.draggable ).detach().appendTo($( "#todoList-ul" ));
      window.save_tasks_in_boxes(0, ui.draggable[0].innerText);
    }
  }).sortable();

  // Delete Area
  $( "#deleteArea" ).droppable({
    drop: function( event, ui ) {
      ui.draggable.remove();
      var task_text = ui.draggable[0].innerText;
      storage.get({[key]: []}, function(items) {
        var new_task_list = items[key].filter(function(filtered) {
          return filtered[0] !== task_text;
        })
        storage.set({[key]: new_task_list});
      })
      $( this ).fadeOut(500);
    }
  });
})

function tutorial() {
  // tutorial on first time
  storage.get({[first_time]: []}, function(_result) {
    // console.log(_result[first_time].length === 0);
    if (_result[first_time].length === 0) {
      totalTaskCount = 1;
      $( "#container-1" ).append('<div class="list"><li draggable="true">' + tutorial_text + '</li></div>');
      updateTaskList();
      UpdateTaskListFunctionality();
    } else { return }
  })
}

function new_storage_init() {
  // Load task count
  storage.get({[count_key]: []}, function(_count) {
    if (_count[count_key].length === 0) {
      _count[count_key] = taskCount;
      storage.set(_count);
    }
    taskCount = _count[count_key];
    //totalTaskCount += taskCount;
  })

  storage.get({[key]: []}, function(items) {

    if (items[key].length + taskCount === 0) {
      totalTaskCount = 1;
    } else {
      totalTaskCount = items[key].length + taskCount;
    }
    document.getElementById('taskCount').innerHTML = (taskCount + " / " + totalTaskCount);

    // console.log(items[key]);

    // Load task list to their belonging
    for (var i = 0; i < items[key].length; i++) {
      switch(items[key][i][1]) {
        case 0:
          //  console.log('0');
          $( "#todoList-ul" ).append('<div class="list"><li draggable="true">' + items[key][i][0] + '</li></div>');
          updateTaskList();
          UpdateTaskListFunctionality();
          continue;
        case 1:
          // console.log('1');
          $( "#container-1" ).append('<div class="list"><li draggable="true">' + items[key][i][0] + '</li></div>');
          updateTaskList();
          UpdateTaskListFunctionality();
          continue;
        case 2:
          // console.log('2');
          $( "#container-2" ).append('<div class="list"><li draggable="true">' + items[key][i][0] + '</li></div>');
          updateTaskList();
          UpdateTaskListFunctionality();
          continue;
        case 3:
          // console.log('3');
          $( "#container-3" ).append('<div class="list"><li draggable="true">' + items[key][i][0] + '</li></div>');
          updateTaskList();
          UpdateTaskListFunctionality();
          continue;
        case 4:
          // console.log('4');
          $( "#container-4" ).append('<div class="list"><li draggable="true">' + items[key][i][0] + '</li></div>');
          updateTaskList();
          UpdateTaskListFunctionality();
          continue;
        default:
          console.log('default');
      }
    }
  }) 
}