var taskCount = 0;

//Regrab .list when new task is added
$(document).ready(function() {
  new_storage_init();
  startTime();
  updateTaskList();
  UpdateTaskListFunctionality();
  //storage_init();

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
        storage.get({[key]: []}, function(items) {
          var new_task_list = items[key].filter(function(filtered) {
            return filtered[0] !== task.currentTarget.innerText;
          })
          storage.set({[key]: new_task_list});
        })
        $( this ).remove();
        taskCount++;
        updateTaskCount();
      });
    });
  });
}


$(function() {

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
      console.log(ui);
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

// function storage_init() {
//   storage.get(null, function(items) {
//     var task_keys = Object.keys(items);
//     console.log('ALL KEYS', task_keys);

//     // Load task list (RHS)
//     var saved_task_list = items["task_id"];

//     if (saved_task_list != null) {
//       for (var i = 0; i < saved_task_list.length; i++) {
//         $( "#todoList-ul" ).append('<div class="list"><li draggable="true">' + saved_task_list[i] + '</li></div>');
//         updateTaskList();
//         UpdateTaskListFunctionality();
//       }
//     }

//     // Load task count
//     var saved_task_count = items["task_count"];
//     if (saved_task_count == null) {
//       saved_task_count = 0;
//     }
//     document.getElementById('taskCount').innerHTML = saved_task_count;
//     taskCount = saved_task_count;

//     // Load the ones in box
//     var box_list = ['box-1', 'box-2', 'box-3', 'box-4'];
//     for (var i = 0; i < box_list.length; i++) {
//       var cur_box = box_list[i];
//         console.log('cur_box', cur_box);
//       var saved_box_task = items[cur_box];
//         console.log('saved_box', saved_box_task);

//       var cur_container = '#container-' + (i + 1);
//       console.log('container',cur_container);
//       if(saved_box_task != null) {
//         for (var j = 0; j < saved_box_task.length; j++) {
//           $(cur_container).append('<div class="list"><li draggable="true">' + saved_box_task[j] + '</li></div>');
//           updateTaskList();
//           UpdateTaskListFunctionality();
//         }
//       }  
//     }   
//   })
// }

function new_storage_init() {
  storage.get({[key]: []}, function(items) {

    // Load task list to their belonging
    for (var i = 0; i < items[key].length; i++) {
      switch(items[key][i][1]) {
        case 0:
          console.log('0');
          $( "#todoList-ul" ).append('<div class="list"><li draggable="true">' + items[key][i][0] + '</li></div>');
          updateTaskList();
          UpdateTaskListFunctionality();
          continue;
        case 1:
          console.log('1');
          $( "#container-1" ).append('<div class="list"><li draggable="true">' + items[key][i][0] + '</li></div>');
          updateTaskList();
          UpdateTaskListFunctionality();
          continue;
        case 2:
          console.log('2');
          $( "#container-2" ).append('<div class="list"><li draggable="true">' + items[key][i][0] + '</li></div>');
          updateTaskList();
          UpdateTaskListFunctionality();
          continue;
        case 3:
          console.log('3');
          $( "#container-3" ).append('<div class="list"><li draggable="true">' + items[key][i][0] + '</li></div>');
          updateTaskList();
          UpdateTaskListFunctionality();
          continue;
        case 4:
          console.log('4');
          $( "#container-4" ).append('<div class="list"><li draggable="true">' + items[key][i][0] + '</li></div>');
          updateTaskList();
          UpdateTaskListFunctionality();
          continue;
        default:
          console.log('default');
      }
    }
  }) 

  // Load task count
  storage.get({[count_key]: []}, function(_count) {
    if (_count[count_key].length === 0) {
      _count[count_key] = taskCount;
      storage.set(_count);
    }
    taskCount = _count[count_key];
    document.getElementById('taskCount').innerHTML = taskCount;
  })

}