// Horizontal line animation
$(document).ready(function(){
    setTimeout(function(){
        $('.expand').addClass('grow');
        // console.log("expand working")
    }, 275);
});

// Vertical line animation
$(document).ready(function(){
    setTimeout(function(){
        $('.expandVertical').addClass('growVertical');
        // console.log("expand vertical working")
    }, 275);
});

// Separation line animation
$(document).ready(function(){
	var count = 0;
    setInterval(function(){
        $('.separateExpand').addClass('separateGrow');
    }, 275);
});