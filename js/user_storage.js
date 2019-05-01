function saveChanges(task) {
	if (!task) {
	  console.log('Error: No value specified');
	  return;
	}

	var all_tasks = document.getElementsByClassName( 'list' );
	var all_tasks_list = [];

	for (var i = 0; i < all_tasks.length; i++) {
		console.log(all_tasks[i].innerText);
		all_tasks_list.push(all_tasks[i].innerText);
	}
	// Save it using the Chrome extension storage API.
	chrome.storage.local.set({task_id: all_tasks_list});
}

function save_task_count(count) {
	chrome.storage.local.set({task_count: count});
}