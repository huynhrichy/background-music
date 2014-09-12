var song = ""; // YouTube video ID
var latitude; 
var longitude; 
var weatherType = "";

// Endpoint for the OpenWeatherMap API - string to be appended with location info
var weatherURL = "http://api.openweathermap.org/data/2.5/weather?";

// YouTube Player API
// Creates an iframe for the DOM to embed the player
var player;
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setCoordinates);
    } 
}

function setCoordinates(position) {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;

	getWeather();
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
    	height: '196.875 ',
        width: '350',
       	videoId: song,
        events: {
        	'onReady': onPlayerReady,
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function stopVideo() {
	player.stopVideo();
}

function showPlayer() {
	$('.info').addClass('hidden');
	$('#player').removeClass('hidden');
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Song choice based on icons for weather types for simplicity
function decideSong(icon) {
	//if icon is clear sky
	if(icon == '01d' || icon == '01n') {
		//song = "ARDDZsIj5bE"; // besaid
		song = "xwuXLqqw_gU"; // breezy
	}
	
	//if icon is clouds
	if(icon == '02d' || icon == '02n' || icon == '03d' || icon == '03n' || icon == '04d' || icon == '04n') {
		song = "utt7YbfkJvg"; // beyond the darkness
		
	}
	
	//if icon is rain
	if(icon == '09d' || icon == '09n' || icon == '10d' || icon == '10n') {
		song = "-15xE5U9BCQ"; // calm before the storm
	}
	
	//if icon is thunderstorm
	if(icon == '11d' || icon == '11n') {
		song = "7Ax45TprB4A";
	}
	
	//if icon is snow
	if(icon == '13d' || icon == '13n') {
		//song = "9jz644GeAdE"; // macalania woods
		song = "UgsC3fk7E-k" // phantoms
		
	}
	
	//if icon is mist
	if(icon == '50d' || icon == '50n') {
		song = "i_QxGtXSa9E"; // secret of the forest
	}
}

// Uses OpenWeatherMap API to get weather information for the given coordinates
function getWeather() {
	weatherURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude;

	var result = $.ajax({
		type: 'GET',
		dataType: 'jsonp',
		url: weatherURL
	})
	.done(function(data) {
			decideSong(data.weather[0].icon);

			if (!($('iframe').length)) {
				showPlayer();	
			}
			else {
				player.loadVideoById(song);
			}
	})
	.fail(function(jqXHR, error, errorThrown) {
	});
}

// Uses Geobytes' free web services to get information about a city
function getCityData(city) {
	$.getJSON("http://gd.geobytes.com/GetCityDetails?callback=?&fqcn=" + city, 
		function(data) {
			latitude = data.geobyteslatitude;
			longitude = data.geobyteslongitude;
		})
	.done(function() {
		getWeather();
	})
	.fail(function(jqXHR, error, errorThrown) {
	});
}

$(document).ready(function() {
	// Attempts to use HTML5 Geolocation first
	getLocation();
	
	// Geobyte's Ajax Autocomplete List Cities JSON-P API 
	// Accesses Geobyte's free web services to get the list of cities
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
		select: function(event, ui) {;
			var city = ui.item.value;

			$("#city-input").val(city);

			getCityData(city);

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