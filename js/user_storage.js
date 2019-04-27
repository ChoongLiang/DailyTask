var task_list = {'task': ['Task 1', 'Task 2', 'More tasks']};
var task_count = 0;
var task_str = 'task';

function saveChanges(task) {
	save_task();
	console.log(task);
	if (!task) {
	  console.log('Error: No value specified');
	  return;
	}
	task_count++;
	var task_id = task_str + task_count;
	console.log('id:',task_id);
	// Save it using the Chrome extension storage API.
	chrome.storage.local.set({task_id: task, 'task_counter': task_count}, function() {
		// Notify that we saved.
		console.log('Total tasks:', task_count, '.', task_id, ':', task);
	});
}

function save_task() {
	const list_items = document.getElementsByClassName( 'list' );
	var task_list = [];
	for (item of list_items){
		console.log('save_task(), inner text', item.innerText);
		item_text = item.innerText;
		chrome.storage.local.set({item_text: item_text});
	}
	console.log(task_list);
}