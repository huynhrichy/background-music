var song = "";
var city = "";
var weatherURL = "http://api.openweathermap.org/data/2.5/weather?";
var latitude;
var longitude;
var weatherType = "";

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
//firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


//getLocation();

function getLocation() {
	//alert();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setCoordinates);
    } 
}
function setCoordinates(position) {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;

	getWeather();
}

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

function decideSong(icon) {
	//alert(icon);

		//if icon is clear sky
		if(icon == '01d' || icon == '01n') {
		
			//iconName = 'clear';
    		
			//song = "ARDDZsIj5bE"; // besaid
			song = "xwuXLqqw_gU"; // breezy
		}
		
		//if icon is clouds
		if(icon == '02d' || icon == '02n' || icon == '03d' || icon == '03n' || icon == '04d' || icon == '04n') {
		
			//iconName = 'clouds';
			song = "utt7YbfkJvg"; // beyond the darkness
    		
		}
		
		//if icon is rain
		if(icon == '09d' || icon == '09n' || icon == '10d' || icon == '10n') {
		
			//iconName = 'rain';
    		
    		song = "-15xE5U9BCQ"; // calm before the storm
		}
		
		//if icon is thunderstorm
		if(icon == '11d' || icon == '11n') {
		
			//iconName = 'storm';
    		song = "7Ax45TprB4A";
		}
		
		//if icon is snow
		if(icon == '13d' || icon == '13n') {
		
			//iconName = 'snow';
			//song = "9jz644GeAdE"; // macalania woods
			song = "UgsC3fk7E-k" // phantoms
    		
		}
		
		//if icon is mist
		if(icon == '50d' || icon == '50n') {
		
			//iconName = 'mist';
			song = "i_QxGtXSa9E"; // secret of the forest
		}



}

function getWeather() {
	var request;
	

	weatherURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude;

	var result = $.ajax({
		type: 'GET',
		dataType: 'jsonp',
		url: weatherURL
	})
	.done(function(data) {
		alert(data.weather[0].description);
		//alert(data.weather[0].icon);

		// decide song
		
			decideSong(data.weather[0].icon);

			if (!($('iframe').length)) {

				showPlayer();	
			}
			else {
				// reload
				player.loadVideoById(song);
			}
		        		

	})
	.fail(function(jqXHR, error, errorThrown) {
	});
}

function getCityData() {
	$.getJSON("http://gd.geobytes.com/GetCityDetails?callback=?&fqcn=" + city, 
		function(data) {
			latitude = data.geobyteslatitude;
			longitude = data.geobyteslongitude;
		})
	.done(function() {
		//alert(latitude + ' ' + longitude);
		getWeather();
	});
}

$(document).ready(function() {

//getLocation();
	
	/* 
	Geobyte's Ajax Autocomplete List Cities JSON-P API 
	Accesses Geobyte's free web services to get the list of cities
	*/

	var ish;
	$("#city-input").autocomplete({
		source: function(request, response) {
			$.getJSON(
			"http://gd.geobytes.com/AutoCompleteCity?callback=?&q=" + request.term,
			function(data) {
				response(data);
			}
			);
		},
		minLength: 3,
		select: function(event, ui) {
			var selectedObj = ui.item;
			$("#city-input").val(selectedObj.value);

			//alert(ish.geobyteslatitude);

			// weather ish
			city = selectedObj.value;

			getCityData();

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