var taskCount = 0,
    totalTaskCount = 0;
const tutorial_text = "Double click to complete task",
      increase = -1,
      decrease = -10,
      max_str_len = 45;

//Regrab .list when new task is added
$(document).ready(function() {
  tutorial();
  new_storage_init();
  startTime();
  updateTaskList();
  UpdateTaskListFunctionality();
  window.onLoadHeight();

  $( '#deleteArea' ).hide(); // Hide 'trash bin' 
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

// Increase = 10 / Decrease = 11 / Re-Calculate = 12
function updateTotalTaskCount(command) {
  $( '#taskCount' ).fadeIn(500);
  if (command === increase){
    totalTaskCount++;
  } else if (command === decrease) {
    totalTaskCount--;
  } else{
    if (command < totalTaskCount) {
      totalTaskCount -= command;  
    } else {
      totalTaskCount = 0;
    }
  }
  document.getElementById('taskCount').innerHTML = (taskCount + " / " + totalTaskCount);
}

// "enter" key should check for new task form instead of refreshing the page
$(document).on('keypress',function(e) {
    if(e.which == 13) {
        newTaskBtn();
    }
});

// Last step, grab form value and verify
function newTaskBtn(task = null){
  if (task === null) {
    task = $('#newTaskForm').val().trim();
  }
  if(task === "" || task.length > max_str_len) {
    alert('Empty field or task name too long!');
    console.log("Empty field!");
    return
  }

  // Append as list item
  task = capitalizeFirstLetter(task);
  $( "#todoList-ul" ).append('<div class="list"><li draggable="true">' + task + '</li></div>');
  updateTaskList();
  UpdateTaskListFunctionality();
  window.saveChanges(task);
  document.getElementById('newTaskForm').value = "";
  updateTotalTaskCount(increase);
}

function updateTaskList() {
  $('.list').draggable({
    helper:"clone",
    containment:"document",
    stack: ".list"
  });
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
        console.log(task.currentTarget.innerText === tutorial_text);
        if (task.currentTarget.innerText === tutorial_text){
          storage.set({[first_time]: 1});
        }
        storage.get({[key]: []}, function(items) {
          var new_task_list = items[key].filter(function(filtered) {
            return filtered[0] !== task.currentTarget.innerText;
          })
          storage.set({[key]: new_task_list});
        })

        $( this ).remove();
        taskCount++;
        updateTaskCount();
        getLineHeight();
      });
    });
  });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getLineHeight() {

  // Horizontal line & Container 1-2 
  for (var i = 1; i < 5; i++) {
    $('#container-' + i).height(_auto);
  }

  var h_max = Math.max($('#container-1').height(), 
                       $('#container-2').height());
  var t_max = min_height;

  if (h_max < min_height) {
    $('.horizontal').css({top: min_height + mar_pad});

    for (var i = 1; i < 3; i++) { 
      $('#container-' + i).height(min_height); 
    }
  } else {
    t_max = h_max;
    $('.horizontal').css({top: h_max + mar_pad});
    for (var i = 1; i < 3; i++) { 
      $('#container-' + i).height(h_max); 
    }
  }
  storage.set({[top_height]: t_max});

  // Verticle line & Container 3-4
  var v_max = Math.max($('#container-3').height(), 
                       $('#container-4').height());

  if (v_max < min_height) {
    v_max = min_height;
    $('.vertical').height(t_max + min_height);
    for (var i = 3; i < 5; i++) { 
      $('#container-' + i).height(min_height); 
    }
  } else {
    $('.vertical').height(t_max + v_max + mar_pad);
    for (var i = 3; i < 5; i++) { 
      $('#container-' + i).height(v_max); 
    }
  }
  storage.set({[btm_height]: v_max});

  // Then don't forget to change the placement of Not urgent text
  $('.notImportant').css({top: t_max + (v_max)/2 + mar_pad});
  storage.set({[notImportantHeight]: t_max + (v_max)/2 + mar_pad});
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
        updateTotalTaskCount(items[key].length - new_task_list.length);
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
      getLineHeight();
    }
  })
  $( "#container-2").droppable({
    drop: function( event, ui ) {
      ui.draggable.detach().appendTo($(this));
      window.save_tasks_in_boxes(2, ui.draggable[0].innerText);
      getLineHeight();
    }
  })
  $( "#container-3").droppable({
    drop: function( event, ui ) {
      ui.draggable.detach().appendTo($(this));
      window.save_tasks_in_boxes(3, ui.draggable[0].innerText);
      getLineHeight();
    }
  })
  $( "#container-4").droppable({
    drop: function( event, ui ) {
      ui.draggable.detach().appendTo($(this));
      window.save_tasks_in_boxes(4, ui.draggable[0].innerText);
      getLineHeight();
    }
  })

  $( "#todoList" ).droppable({
    drop: function( event, ui ) {
      $( ui.draggable ).detach().appendTo($( "#todoList-ul" ));
      window.save_tasks_in_boxes(0, ui.draggable[0].innerText);
      getLineHeight();
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
      updateTotalTaskCount(decrease);
      getLineHeight();
    }
  });
})

function tutorial() {
  // tutorial on first time
  storage.get({[first_time]: []}, function(_result) {
    if (_result[first_time] !== 1) {
      storage.get({[key]: []}, function(items) {
        if (items[key].length !== 0){ 
          for (var i = 0; i < items[key].length; i++) {
            if (items[key][i][0] === tutorial_text) {
              return
            }
          }
        } else { newTaskBtn(tutorial_text); }
      })
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
  })

  storage.get({[key]: []}, function(items) {

    totalTaskCount = items[key].length + taskCount;
    document.getElementById('taskCount').innerHTML = (taskCount + " / " + totalTaskCount);

    // Load task list to their belonging
    for (var i = 0; i < items[key].length; i++) {
      // console.log(items[key][i]);
      switch(items[key][i][1]) {
        case 0:
          // console.log('0');
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