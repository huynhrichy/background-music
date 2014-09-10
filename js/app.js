var song = "";
var city = "";
var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=";
var latitude;
var longitude;

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
//firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
    	height: '196.875 ',
        width: '350',
        //videoId: 'M7lc1UVf-VE',
       	videoId: song,
        events: {
        	'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}

var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
		//setTimeout(stopVideo, 6000);
		//done = true;
    }
}

function stopVideo() {
	player.stopVideo();
}

function showPlayer() {
	$('.info').addClass('hidden');
	$('#player').removeClass('hidden');
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function decideSong() {
	song = "ARDDZsIj5bE"; // besaid x-2
}

function getWeather() {
	var request;

	var result = $.ajax({
		type: 'GET',
		dataType: 'jsonp',
		url: ''
	})
	.done(function(data) {

	})
	.fail(function(jqXHR, error, errorThrown) {
	});
}

$(document).ready(function() {
	/* 
	Geobyte's Ajax Autocomplete List Cities JSON-P API 
	Accesses Geobyte's free web services to get the list of cities
	*/
	$("#city-input").autocomplete({
		source: function(request, response) {
			$.getJSON(
			"http://gd.geobytes.com/AutoCompleteCity?callback=?&q=" + request.term,
			function(data) {
				response(data);
				//alert(data.geobyteslatitude);
			}
			);
		},
		minLength: 3,
		select: function(event, ui) {
			var selectedObj = ui.item;
			$("#city-input").val(selectedObj.value);

			// weather ish
			city = selectedObj.value;

			decideSong();

			showPlayer();
			//

			return false;
		},
		open: function() {
			$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
		},
		close: function() {
			$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
		}
	 });
	 $("#city-input").autocomplete("option", "delay", 100);


});



