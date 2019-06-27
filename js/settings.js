/* Switching, then saving and fetching to storage 
Background and 4-Quadrants Color */
const bg_id = "#background_checkbox";
const _url = "https://images.unsplash.com/photo-1553356126-71d9da2295e2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjI0MX0&auto=format&fit=crop&w=1680&q=80"

// $(document).ready(function() {
//   set_bg();
// });

// document.getElementById(bg_id).onclick = function() {
// 	if(this === null) { console.log("null"); }
// 	if (this.checked){
// 		console.log("checked");
// 	}
// 	else {
// 		console.log("unchecked");
// 	}
// }


// function set_bg() {
// 	var bg_switch = document.getElementById(bg_id);

// 	if (bg_switch === null) { return }

// 	else if (bg_switch.checked) {
// 		window.setBackground(_url);
// 		// document.body.style.background = 'url(' + _url + ')';
// 	}
// 	else {
// 		console.log('unchecked');
// 	}
// }

$(bg_id).click(function() {
    console.log("checked");
    window.setBackground(_url);
    // document.body.style.background = 'url(' + _url + ')';
    // $("#txtAge").toggle(this.checked);
});
