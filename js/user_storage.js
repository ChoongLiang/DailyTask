const storage = chrome.storage.local;
const key = 'task_id';
const count_key = 'task_count';
const first_time = 'new';

function saveChanges(task, box = 0) {
	if (!task) {
	  console.log('Error: No value specified');
	  return;
	}

	paired_list = [task, box];
	storage.get({[key]: []}, function(list_of_lists) {
		list_of_lists[key].push(paired_list);
		storage.set(list_of_lists);
	})
}

function save_task_count(count) {
	storage.set({[count_key]: count});
}

function save_tasks_in_boxes(cur_box, task_text) {
	// 'task_id' : [[gym, 0],[work, 1],[sleep, 4]]
	storage.get({[key]: []}, function(list_of_lists) {
		for (var x = 0; x < list_of_lists[key].length; x++) {
			if (list_of_lists[key][x][0] === task_text) {
				list_of_lists[key][x][1] = cur_box;
				storage.set(list_of_lists);
				break;
			}
		}
	})
}