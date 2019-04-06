var task = null;

// Button event listener
$(document).ready(function() {
    $("#newTaskBtn").click(function(){
		// Grab form value
		task = $('#newTaskForm').val();
		console.log(task)

		if(task === "" || task === "null") {
			console.log("Empty field!");
		}else{
			// console.log('<li draggable="true" class="list">' + task +'</li>');
			// Append as list item
			$("#todoList ul").append('<li draggable="true" class="list">' + task + '</li>');
			window.updateTaskList();
		}
    }); 
});

// Delete button for task list
function deleteTask(e){
	var trash = this;
	$(".list").hover(
			//function(){$(this).show()},
			//function(){$(this).hide()},
			console.log('Add')
	)

}
