const storage = chrome.storage.local;
const key = 'task_id';
const count_key = 'task_count';
const first_time = 'new';
const top_height = 'top';
const btm_height = 'bottom';
const notUrgentHeight = 'noturgent';
const min_height = 365;
const mar_pad = 62.5;
const _auto = 'auto';

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
				var new_task_list = list_of_lists[key].filter(function(filtered) {
            		return filtered[0] !== task_text;
        		})
        		new_task_list.push([task_text, cur_box]);
				storage.set({[key]: new_task_list});
				break;
			}
		}
	})
}

function onLoadHeight() {
  var temp_top_height = min_height;
  // Init container 1-2 height & horizontal line
  storage.get({[top_height] : []}, function(th) {
    if (th[top_height] === 0 || th[top_height] < min_height) {
    	$('.horizontal').css({top: min_height + mar_pad});
    	for (var i = 1; i < 3; i++){ $('#container-' + i).height(min_height); }
    } else {
    	$('.horizontal').css({top: th[top_height] + mar_pad});
    	for (var i = 1; i < 3; i++){ $('#container-' + i).height(th[top_height]); }
    	temp_top_height = th[top_height];
    }
  })

  // Init container 3-4 height
  storage.get({[btm_height] : []}, function(bh) {
    if (bh[btm_height] === 0 || bh[btm_height] < min_height) {
    	$('.vertical').height(temp_top_height + min_height + mar_pad);
    	for (var i = 3; i < 5; i++){ $('#container-' + i).height(min_height); }
    } else {
    	$('.vertical').height(temp_top_height + bh[btm_height] + mar_pad);
    	for (var i = 3; i < 5; i++) { $('#container-' + i).height(bh[btm_height]); }
    }
  })

  // Init not urgent text height
  storage.get({[notUrgentHeight]: []}, function(h) {
  	if(h[notUrgentHeight] === 0 || h[notUrgentHeight] < (min_height) * 1.5 + mar_pad){
  		$('.notUrgent').css({top: (min_height) * 1.5 + mar_pad});
  	} else {
  		$('.notUrgent').css({top: h[notUrgentHeight]});
  	}
  })
  return;
}